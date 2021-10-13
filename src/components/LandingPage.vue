<template>
  <vs-row>
    <vs-col
      vs-w="12"
      class="content-container p-20 position-relative"
    >
      <div class="search-container">
        <search-bar
          class="ph-20"
          @change="handleSearch"
        />
      </div>
      <div class="content-table pt-10">
        <vs-table :data="filteredUsers">
          <template slot="thead">
            <vs-th class="select-all-option pb-5">
              <vs-checkbox size="small" />
            </vs-th>
            <vs-th
              v-for="header in fields"
              :key="header['name']"
              class="pb-5"
            >
              {{ header['label'] }}
            </vs-th>
            <vs-th class="pb-5">
              Actions
            </vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr
              v-for="user in data"
              :key="user['id']"
            >
              <vs-td>
                <vs-checkbox size="small" />
              </vs-td>
              <td
                v-for="info in fields"
                :key="info['name']"
                class="text-align-left"
              >
                {{ user[info['name']] }}
              </td>
              <vs-td class="text-align-left">
                <vs-icon class="fas fa-edit ph-5 text-lightestgrey" />
                <vs-icon class="far fa-trash-alt ph-5" />
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
      <div class="footer-content">
        <app-pagination
          v-if="! searchKeyword.length"
          :total="users.length"
          :current-page="currentPage"
          :records-per-page="recordsPerPage"
          @change="updatePagination"
        />
      </div>
    </vs-col>
  </vs-row>
</template>

<script>
  import axios from 'axios';
  import SearchBar from './SearchBar';
  import AppPagination from './AppPagination';

  export default {
    name: 'LandingPage',
    components: { AppPagination, SearchBar },
    data: function () {
      return {
        users: [],
        fields: [
          {
            name: 'name',
            label: 'Name',
          },
          {
            name: 'email',
            label: 'Email'
          },
          {
            name: 'role',
            label: 'Role'
          }
        ],
        searchKeyword: '',
        currentPage: 1,
        recordsPerPage: 10,
        startRecordIndex: 0,
        endRecordIndex: 0,
      };
    },
    computed: {
      filteredUsers: function () {
        if(this.searchKeyword.length) {
          let searchWord = this.searchKeyword.toLowerCase();
          return this.users.filter(user => {
            return user['name'].toLowerCase().includes(searchWord) ||
              user['email'].toLowerCase().includes(searchWord) ||
              user['role'].toLowerCase().includes(searchWord);
          });
        } else {
          return this.users.slice(this.startRecordIndex, this.endRecordIndex);
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
          this.updateIndices();
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
        this.searchKeyword = searchKeyword;
      },
      updatePagination: function (page) {
        this.currentPage = page;
        this.updateIndices();
      },
      updateIndices: function () {
        this.endRecordIndex = (this.currentPage * this.recordsPerPage);
        this.startRecordIndex = this.endRecordIndex - this.recordsPerPage;
      }
    }
  };
</script>

<style scoped lang="scss">
  .content-container {
    max-height: 100vh;
    overflow-y: auto;
  }
  .content-table {
    height: 80vh;
  }
  .search-container {
    height: calc(10vh - 20px);
  }
  .footer-content {
    height: calc(10vh - 20px);
  }
  .select-all-option {
    display: flex;
    justify-content: center !important;
  }
</style>
