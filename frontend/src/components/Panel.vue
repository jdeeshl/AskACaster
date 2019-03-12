<template>
    <div class="container">
    <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"></script>
    <h1>Questions</h1>
    <ul>
        <li v-for="question in questions">{{question}}</li>
    </ul>
    <input v-model="message" placeholder="edit me">
    </div>
</template>

<script>
const URL = 'http://127.0.0.1:3000/'

export default {
  name: 'Panel',
  data(){
      return {
          questions : []
      }
  },
  methods: {
      fetchQuestion() {
          fetch(URL + 'questions?user_id=kneekey23', {
              method: 'GET',
              headers: new Headers({'Content-Type': 'application/json'})


          }).then((data) => data.json())
          .then(result => {
              console.log(result);
              this.questions = result;
          })
          //this.questions = ['api question 1', 'api question 2', 'api question 3']
      },
       askQuestion() {
        console.log('asking a question');
        fetch(URL + 'question', {
            method: 'PUT',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                user_id: 'mauerbac',
                channel_id: 'mauerbac',
                question: 'testing a question',
                postedToForum: false,
            })


        }).then((data) => data.json())
        .then(result => {
            console.log(result);
        })
        //this.questions = ['api question 1', 'api question 2', 'api question 3']
    }
  },
  beforeMount() {
      this.fetchQuestion();
      this.askQuestion();
  }
}
</script>
