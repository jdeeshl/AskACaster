<template>
    <div class="container">
        <div>
            <h3 class="title"> Channel Questions Test </h3> 
            <hr />
            <ul class="question-list" v-show="questions.length > 0">
                    <li class="question-item" v-for="(question, index) in questions" :key="index">
                        <h2 class="question-item__question">{{question.question}}</h2>
                        <div class="row">
                            <p class="question-item__submitted-by">Submitted by {{ question.displayName }}</p>
                            <img class="question-item__checkmark" v-if="showCheckMark[index]" src="../assets/checkmark.png" />
                            <button @click="showInputChange(index)" class="question-item__button question-item__answer-button">Answer</button>
                        </div>
                        <p class="question-item__answer">{{question.answer}}</p>
                        <div class="question-item__answer-box" :key="index" v-if="showInput[index]">
                            <textarea type="text" v-model="answerText[index]" class="question-item__answer-input"></textarea>
                            <button @click="showInputChange(index)" class="question-item__button question-item__answer-cancel">Cancel</button>
                            <button @click="submitAnswer(question.id, index)" class="question-item__button question-item__answer-submit">Submit</button>
                        </div>
                    </li>
            </ul>
        </div>

    </div>
</template>

<script>
const ROOT_URL = 'https://localhost:3000/';
let userID = '';
let channelID= '';
let token = '';
let clientID = '';
const twitch = window.Twitch.ext;
const twitchClientID = 'wkor7zg4sgp2joyf3fxkm2gq8j6kb6';


export default {
  name: 'LiveConfig',
  data() {
      return {
          questions: [],
          showInput: [],
          answerText: [],
          showCheckMark: []
      }
  },
  methods: {
      pullQuestions(){

          fetch(`${ROOT_URL}channelquestions?channel_id=${channelID}`,{
              method: 'GET',
              headers: new Headers({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`})
          }).then(data => data.json()).then(result => {
              this.questions = result;
              result.forEach((x, i) => {
                  
                  this.showInput[i] = false;
                  this.showCheckMark[i] = !!x.answer && x.answer.length > 0;
            
              })
          });
      },

      showInputChange(index){
        if (this.showInput[index] == undefined) {
        this.showInput[index] = false;
        }

        this.showInput = { ...this.showInput, [index]: !this.showInput[index] };
         
      },
      submitAnswer(id, index) {
          fetch(`${ROOT_URL}answer`, {
              method: 'POST',
              headers: new Headers({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}),
              body: JSON.stringify({
                  answer: this.answerText[index],
                  id: id
                  })
          }).then(result => result.json())
          .then(data => {
              this.questions[index].answer = this.answerText[index];
              this.answerText[index] = '';
              this.showCheckMark[index] = true;
              this.showInputChange(index);
          })
      }

  },
  async beforeMount() {
    await twitch.onAuthorized((auth) => {  
    userID = auth.userId;
    channelID = auth.channelId; 
    clientID = auth.clientId
    token = auth.token;
    this.pullQuestions();

});
    
  }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}
.container {
    background: #FAF9FA;
    padding: 20px;
    --twitch-purple: #6441A4;
    --text-color-primary: #19171C;
    --text-color-secondary: #6E6779;
    --text-base-size: 12px;
    font-size: var(--text-base-size);
}

.title {
    font-size: 24px;
    color: var(--text-color-primary);
}

.row {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
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
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
}

.question-item:hover {
    background: #FAF9FA;
}

.question-item__question {
    font-size: 16px;
    font-weight: 400;
    margin: 0 0 4px;
    color: var(--text-color-primary);
}

.question-item__submitted-by {
    flex: 1 1 100%;
    font-size: 12px;
    margin: 0;
    color: var(--text-color-secondary);
}

.question-item__answer {
    font-size: 14px;
}

.question-item__button {
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    min-height: 30px;
    min-width: 60px;
    border-radius: 4px;
    border: none;
    font-weight: 400;
    line-height: 1;
    font-size: var(--text-base-size);
}

.question-item__answer-button {
    color: var(--twitch-purple);
    margin-top: -6px;
    background: none;
}

.question-item__checkmark {
    width: 24px;
    height: 24px;
    margin-top: -5px;
}

.question-item__answer-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: flex-start;
}

.question-item__answer-input {
    flex: 1 0 100%;
    min-height: 60px;
    border: 1px solid #DAD8DE;
    border-radius: 4px;
    margin-bottom: 5px;
    padding: 10px;
    font-size: var(--text-base-size);
}

.question-item__answer-input:focus {
    border-color: var(--twitch-purple);
}

.question-item__answer-submit {
    background-color: var(--twitch-purple);
    color: #fff;
}

.question-item__answer-cancel {
    border: 1px var(--twitch-purple) solid;
    color: var(--twitch-purple);
    margin-right: 4px;
}
</style>