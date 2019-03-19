<template>
    <div class="container">
        <h1>Ask A Question</h1>
        <b-form-textarea v-model="questionText" id="textarea-small" size="sm" placeholder="Ask the broadcaster a question..." />
        <b-button @click="askAQuestion" variant="outline-primary">Submit Question</b-button>
        <div v-show="questions.length > 0">
            <h3> Previous Questions </h3> 
                  
            <b-list-group>
                <b-list-group-item v-for="(question, index) in questions" :key=index>{{question.question}}</b-list-group-item>
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
          })
      }
  },
  async beforeMount() {
    console.log(`This is the userID:${userID}`);
    await twitch.onAuthorized((auth) => {  
    userID = auth.userId;
    channelID = auth.channelId; 
    token = auth.token;
    console.log(`does the userID load ${userID}`);
    this.pullQuestions();
});
    
  }
}
</script>