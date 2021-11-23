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
              <vs-checkbox
                v-model="isAllUsers"
                :disabled="! filteredUsers.length || searchKeyword.length"
                icon="fas fa-check"
                icon-pack="fa5"
                size="small"
                @change="selectAll"
              />
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
                <vs-checkbox
                  v-model="user['is-selected']"
                  icon="fas fa-check"
                  icon-pack="fa5"
                  size="small"
                  @change="selectUser(user)"
                />
              </vs-td>
              <td
                v-for="info in fields"
                :key="info['name']"
                :class="info['name'] !== 'email' ? 'text-capitalize' : ''"
                class="text-align-left"
              >
                {{ user[info['name']] }}
              </td>
              <vs-td class="text-align-left">
                <vs-icon
                  class="fas fa-edit ph-5 text-lightestgrey pointer-cursor hover:text-primary"
                  @click="editUser(user)"
                />
                <vs-icon
                  class="far fa-trash-alt ph-5 pointer-cursor hover:text-primary"
                  @click="deleteUsers([user])"
                />
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
      <div class="footer-content flex-box ph-25">
        <vs-button
          v-if="(selectedUsers.length || isAllUsers) && ! searchKeyword.length"
          color="danger"
          class="font-small pv-3 mv-5 ph-10"
          @click="deleteUsers"
        >
          Delete
        </vs-button>
        <app-pagination
          v-if="! searchKeyword.length && users.length && users.length > recordsPerPage"
          :total="users.length"
          :current-page="currentPage"
          :records-per-page="recordsPerPage"
          @change="updatePagination"
        />
      </div>
      <delete-user
        :users="selectedUsers"
        :show="showDeletePopup"
        @delete="handleDeletion"
        @close="closeDeletePopup"
      />
    </vs-col>
  </vs-row>
</template>

<script>
  import axios from 'axios';
  import SearchBar from './SearchBar';
  import AppPagination from './AppPagination';
  import DeleteUser from './DeleteUser';

  export default {
    name: 'LandingPage',
    components: { DeleteUser, AppPagination, SearchBar },
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
        recordsPerPage: 11,
        startRecordIndex: 0,
        endRecordIndex: 0,
        isAllUsers: false,
        selectedUsers: [],
        showDeletePopup: false,
        showEditPopup: false,
        editingUser: null,
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
          this.users = users.map(user => {
            this.$set(user, 'is-selected', false);
            return user;
          });
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
      },
      selectUser: function (user) {
        let existingIndex = this.selectedUsers.findIndex(u => u['id'] === user['id']);
        if(existingIndex === -1) {
          this.selectedUsers.push(user);
        } else {
          this.selectedUsers.splice(existingIndex, 1);
        }
      },
      selectAll: function () {
        this.users.forEach(user => {
          user['is-selected'] = this.isAllUsers;
        });
        this.selectedUsers = this.deepCopy(this.users);
      },
      editUser: function (user) {
        this.editingUser = user;
        this.showEditPopup = true;
      },
      handleEditedUser: function (user) {
        let editingIndex = this.users.findIndex(u => u['id'] === user['id']);
        this.users[editingIndex] = user;
      },
      deleteUsers: function (users) {
        if(users.length) {
          this.selectedUsers = users;
        }
        this.showDeletePopup = true;
      },
      closeDeletePopup: function () {
        this.showDeletePopup = false;
      },
      handleDeletion: function (users) {
        this.users = this.users.filter(user => {
          let existingUserIndex = users.findIndex(u => u['id'] === user['id']);
          return existingUserIndex === -1;
        });
        this.closeDeletePopup();
        this.isAllUsers = false;
        this.selectedUsers = [];
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
