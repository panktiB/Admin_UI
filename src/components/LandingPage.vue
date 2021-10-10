<template>
  <vs-row>
    <vs-col
      vs-w="12"
    >
      <search-bar
        @change="handleSearch"
      />
      <div
        v-for="user in filteredUsers"
        :key="user['id']"
        class="p-5"
      >
        {{ user['name'] }}
      </div>
    </vs-col>
  </vs-row>
</template>

<script>
  import axios from 'axios';
  import SearchBar from './SearchBar';

  export default {
    name: 'LandingPage',
    components: { SearchBar },
    data: function () {
      return {
        users: [],
        searchKeyword: '',
      };
    },
    computed: {
      filteredUsers: function () {
        if(this.searchKeyword.length) {
          let searchWord = this.searchKeyword.toLowerCase();
          let searchFields = ['name', 'email', 'role'];
          let a = this.users.filter(user => {
            return user['name'].toLowerCase().includes(searchWord) ||
              user['email'].toLowerCase().includes(searchWord) ||
              user['role'].toLowerCase().includes(searchWord);
          });
          return a;
        } else {
          return this.users;
        }
      }
    },
    mounted () {
      this.getUsers();
    },
    methods: {
      getUsers: function () {
        this.fetchUsers().then(users => {
          this.users = users;
        }).catch(error => {
          console.log(error);
        });
      },
      fetchUsers: function () {
        return new Promise((resolve, reject) => {
          axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json').then(response => {
            resolve(response['data']);
          }).catch(error => {
            reject(error);
          });
        });
      },
      handleSearch: function (searchKeyword) {
        console.log(searchKeyword);
        this.searchKeyword = searchKeyword;
      }
    }
  };
</script>
