<template>
    <div>
        <div class="container">
            <notifications position="bottom" />
            <h2 class="title">Ask A Question</h2>
            <textarea class="question-input" v-model="questionText" placeholder="Ask the broadcaster a question..."></textarea>
            <div class="toolbar">
                <button class="askQuestionBtn" @click="askAQuestion" variant="primary">Submit</button>
            </div>
        </div>
        <div class="container questions">
            <h3 class="title">Previous Questions </h3> 
            <ul v-show="questions.length > 0" class="question-list">
                <li v-for="(question, index) in questions" :key="index">
                    <div class="question-item">
                        <p class="question-item__question"><span>Q:</span> {{question.question}}</p>
                        <p class="question-item__answer" v-show="question.answer != null && question.answer != ''"><span>A:</span> {{question.answer}}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
const ROOT_URL = 'https://75k6u78ho9.execute-api.us-east-1.amazonaws.com/prod/';
const twitch = window.Twitch.ext;

let userID = '';
let channelID= '';
let token = '';
let displayName = '';
const headers = { 'Client-ID':  'wkor7zg4sgp2joyf3fxkm2gq8j6kb6' };


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
          console.log('Polling questions');
          fetch(`${ROOT_URL}questions?user_id=${userID}`,{
              method: 'GET',
              headers: new Headers({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`})
          })
          .then(data => data.json())
          .then(result => {
              twitch.rig.log(result);
              this.questions = result;
          });
      },
      askAQuestion(){
          fetch(`${ROOT_URL}question`, {
              method: 'POST',
              headers: new Headers({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}),
              body: JSON.stringify({
                    user_id: `${userID}`,
                    channel_id: `${channelID}`,
                    question: this.questionText,
                    postedToForum: false,
                    // matt. isn't it.
                    displayName: displayName, // ?
                    display_name: displayName
              })
          })
          .then(result => result.json())
          .then(data => {
              //refresh questions
              this.questionText = '';
              this.pullQuestions();
              this.$notify({
                text: 'Your Question has been submitted!',
                type: 'success'
            });
          })
      }
  },
  
  async beforeMount() {
    
    await twitch.onAuthorized((auth) => { 
        const authedUser = twitch.viewer;
        if (!authedUser) {
            return; 
        }
        fetch(`https://api.twitch.tv/helix/users?id=${authedUser.id}`, {headers})
            .then((res) => res.json())
            .then((res) => {
                const [user] = res.data;
                userID = user.id;
                displayName = user.display_name;
                twitch.rig.log(user);
                channelID = auth.channelId; 
                token = auth.token;
                this.pullQuestions();
            })
            .catch((err) => console.error('Something broke.', err));
        
    });
  },
}
</script>
f
<style scoped>
* {
    box-sizing: border-box;
}
body {
    font-family: sans-serif;
}

.container {
    background: #FAF9FA;
    padding: 20px;
}

.question-list {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: hidden;
    border: 1px solid #DAD8DE;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.04), 0px 2px 2px rgba(0, 0, 0, 0.02), 0px 2px 4px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
}

.question-list li:not(:last-child) .question-item {
    border-bottom: 1px solid #DAD8DE;
}

.question-item {
    background: #fff;
    padding: 10px 20px;
    will-change: background;
    transition: background .15s ease;
}

.question-item p {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
}

.question-item:hover {
    background: #FAF9FA;
}

.question-item p span {
    color: #6E6779;
    font-weight: 600;
}

.question-item__answer {
    font-size: 14px;
}

.toolbar {
    display: flex;
}

.askQuestionBtn {
    color: #fff;
    font-size: 12px;
    font-family: sans-serif;
    padding: 0 6px;
    margin: 10px 0 0 auto;
    line-height: 30px;
    background: #6441A4;
    border-radius: 4px;
    display: inline-block;
    -webkit-appearance: none;
    box-shadow: none;
}
.container:not(:last-child) {
    border-bottom: 1px solid #DAD8DE;
}

.question-input {
    -webkit-appearance: none;
    line-height: 18px;
    font-family: inherit;
    font-size: 12px;
    color: #333;
    border: 1px solid #DAD8DE;
    border-radius: 4px;
    background: #fff;
    padding: 4px 10px;
    width: 100%;
    display: block;
    resize: none;
    outline: none;
    min-height: 60px;
}

.question-input:focus {
    border-color: #6441A4;
}

.previousTitle {
    height: 29px;
    left: 20px;
    top: 194px;

    font-family: 'Helvetica Neue';
    font-size: 24px;
    line-height: 29px;

    color: #19171C;
}
.questionText {
    text-align: left;
}

.title {
    font-family: Helvetica Neue;
    font-size: 24px;
    line-height: 29px;
    color: #19171C;
    margin: 0 0 10px;
}

.inputBox {
    height: 60px;
    left: 20px;
    top: 59px;
    /* White $white */
    background: #FFFFFF;
    /* Hinted Grey 12 $hinted-grey-12 */
    border: 1px solid #DAD8DE;
    box-sizing: border-box;
    border-radius: 4px;
}


</style>