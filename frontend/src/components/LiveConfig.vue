<template>
    <div class="container">
        <div v-show="questions.length > 0">
            <h3> Channel Questions </h3> 
            <b-list-group>
                    <b-list-group-item v-for="(question, index) in questions" :key=index>
                        <p>{{question.question}}</p>
                        <button @click="showInputChange" class="btn btn-info">Answer</button>
                        <div v-if="showInput">
                            <input type="text" v-model="answerText" class="form-control"  />
                            <button @click="submitAnswer(question.id)" class="btn btn-primary">Submit Answer</button>
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
          showInput: false,
          answerText: ''
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
          });
      },
      showInputChange(){
          twitch.rig.log(`showInput: ${this.showInput}`);
          this.showInput = !this.showInput;
      },
      submitAnswer(id) {
          fetch(`${ROOT_URL}answer`, {
              method: 'POST',
              headers: new Headers({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}),
              body: JSON.stringify({
                  answer: this.answerText,
                  id: id
                  })
          }).then(result => result.json())
          .then(data => {
              console.log(data);
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