<template>
    <div class="container">
        <div v-show="questions.length > 0">
            <h3> Channel Questions </h3> 
            <hr />
            <b-list-group>
                    <b-list-group-item v-for="(question, index) in questions" :key="index">
                        <p class="questionTitle"><b>{{question.question}}</b></p>
                        <b-button @click="showInputChange(index)" class="answerBtn" variant="primary">Answer</b-button>
                        <div :key="index" v-if="showInput[index]">
                            <input type="text" v-model="answerText[index]" class="form-control"  />
                            <b-button @click="submitAnswer(question.id, index)" class="submitAnswerBtn" variant="primary">Submit</b-button>
                        </div>
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
  name: 'LiveConfig',
  data() {
      return {
          questions: [],
          showInput: [],
          answerText: []
      }
  },
  methods: {
      pullQuestions(){

          fetch(`${ROOT_URL}channelquestions?channel_id=${channelID}`,{
              method: 'GET',
              headers: new Headers({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`})
          }).then(data => data.json()).then(result => {
              twitch.rig.log(result);
              this.questions = result;
              result.forEach((x, i) => {
                  
                  this.showInput[i] = false;
                 // this.$set(this.showIndex, index, false);
              })
          });
      },
      showInputChange(index){
        twitch.rig.log(`showInput: ${this.showInput[index]}`);
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
              console.log(data);
              this.answerText[index] = '';
          })
      }

  },
  async beforeMount() {
    console.log(`This is the userID:${userID}`);
    await twitch.onAuthorized((auth) => {  
    userID = auth.userId;
   
    channelID = auth.channelId; 
    token = auth.token;
    twitch.rig.log(`channelID: ${channelID}`);
    console.log(`does the userID load ${userID}`);
    this.pullQuestions();

});
    
  }
}
</script>

<style scoped>
.answerBtn {
    margin-top: 10px;
    padding-right: 95px;
    padding-left: 95px;
    background-color: #6441A4;
    color: #f8991d !important;
    font-weight: bold;
    margin-bottom: 10px;
}
.submitAnswerBtn{
     margin-top: 10px;
    padding-right: 95px;
    padding-left: 95px;
    background-color: #6441A4;
    color: #f8991d !important;
    font-weight: bold;
    margin-bottom: 10px;
}
</style>