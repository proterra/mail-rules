
<template>
  <section class="section">
    <div class="container">
      <div class="container">
        <h1 class="title">Rules Editor</h1>
        <a
          class="button is-primary"
          @click="submitNewRules()"
        >Submit and reload</a>
                <a
          class="button is-primary"
          @click="refresh()"
        >refresh</a>
      </div>
      <div class="container">
        <monaco-editor
          ref="editor"
          class="editor"
          v-model="code"
          v-bind:options="options"

          v-on:model="inputListeners"
        ></monaco-editor>
      </div>
    </div>
    <div class="container">
      <!-- <ul v-if="errors && errors.length">
        <li v-for="error of errors">
          {{error.message}}
        </li>
      </ul> -->
    </div>
  </section>
</template>

<script>
/* eslint-disable vue/require-v-for-key */
import MonacoEditor from 'vue-monaco'
import axios from 'axios'

export default {
  name: 'RulesEditor',
  components: {
    MonacoEditor
  },
  data () {
    return {
      options: {
        language: 'json',
        theme: 'vs-dark',
        lineNumbers: true,
        automaticLayout: true,
        minimap: {
          enabled: false
        }

      },
      errors: [],
      code: '{ "JSONRules":"here"}'
    }
  },

  methods: {
    async submitNewRules () {
      let data = JSON.parse(this.$refs.editor.getMonaco().getValue())
      try {
        await axios.post(`http://localhost:3000/api/rules`, data)
      } catch (e) {
        console.log(e)
        this.errors.push(e)
      }
    },
    async refresh () {
      try {
        const response = await axios.get(`http://localhost:3000/api/rules`)
        console.log(response.data)
        this.$data.code = JSON.stringify(response.data, 3)
        this.$refs.editor.getMonaco().trigger('anyString', 'editor.action.formatDocument')
        // this.$refs.getAction('editor.action.format').run()
      } catch (e) {
        console.log(e)
        this.errors.push(e)
      }
    },
    inputListeners (evt) {
      console.log(`event : ${evt}`)
      console.log('----')
    }
  }
}
</script>

<style>
.editor {
  height: 600px;
}
</style>
