<template>
    <div class="container">
        <h2 class="title">Ask A Question</h2>
        <hr />
        <b-form-textarea v-model="questionText" id="textarea-small" size="sm" placeholder="Ask the broadcaster a question..." />
        <b-button class="askQuestionBtn pull-right" @click="askAQuestion" variant="primary">Submit Question</b-button>
        <div v-show="questions.length > 0">
            <h3 class="previousTitle"> Previous Questions </h3> 
            <b-alert variant="success" v-show="showAlert">{{uiMessage}}</b-alert>
            <b-list-group v-for="(question, index) in questions" :key="index">
                <b-list-group-item >
                    <p class="questionText"><b>Q: {{question.question}}</b></p>
                    <p class="questionText" v-show="question.answer != null && question.answer != ''"><b>A: </b>{{question.answer}}</p>
                </b-list-group-item>
            </b-list-group>
        </div>

    </div>
</template>

<script>
const ROOT_URL = 'http://127.0.0.1:3000/';
let userID = '';
let channelID= '';
let token = '';
const twitch = window.Twitch.ext;


export default {
  name: 'Panel',
  data() {
      return {
          questions: [],
          questionText: '',
          uiMessage: '',
          showAlert: false,
      }
  },
  methods: {
      pullQuestions(){
          console.log(`${ROOT_URL}questions?user_id=${userID}`);
          fetch(`${ROOT_URL}questions?user_id=${userID}`,{
              method: 'GET',
              headers: new Headers({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`})
          }).then(data => data.json()).then(result => {
              twitch.rig.log(result);
              this.questions = result;
          });
      },
      askAQuestion(){
          fetch(`${ROOT_URL}question`, {
              method: 'PUT',
              headers: new Headers({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}),
              body: JSON.stringify({
                    user_id: `${userID}`,
                    channel_id: `${channelID}`,
                    question: this.questionText,
                    postedToForum: false
              })
          }).then(result => result.json())
          .then(data => {
              //refresh questions
              this.questionText = '';
              this.pullQuestions();
              this.uiMessage = 'Question Submitted';
              this.showAlert = true;
          })
      }
  },
  async beforeMount() {
    console.log(`This is the userID:${userID}`);
    await twitch.onAuthorized((auth) => {  
    userID = auth.userId;
    twitch.rig.log(`userID: ${userID}`);
    channelID = auth.channelId; 
    token = auth.token;
    console.log(`does the userID load ${userID}`);
    this.pullQuestions();
});
    
  }
}
</script>

<style scoped>

.askQuestionBtn {
    margin-top: 10px;
    padding-right: 80px;
    padding-left: 80px;
    background-color: #6441A4;
    color: #f8991d !important;
    font-weight: bold;
}

.previousTitle {
    margin-top: 20px;
}
.questionText {
    text-align: left;
}


</style>