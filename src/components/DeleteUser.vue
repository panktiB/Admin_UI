<template>
  <vs-popup
    title="Delete"
    :active.sync="showPopup"
    icon-pack="fa5"
    icon-close="fas fa-times"
    class="create-challenge-container"
  >
    <div>
      <vs-row class="pb-10">
        Are you sure you want to
        <span v-if="users.length > 1">
          delete all users?
        </span>
        <span v-else>
          delete this user?
        </span>
      </vs-row>
      <vs-row vs-justify="flex-end">
        <vs-button
          class="pv-5 ph-10"
          color="danger"
          type="border"
          @click="confirmDeletion()"
        >
          Delete
        </vs-button>
      </vs-row>
    </div>
  </vs-popup>
</template>

<script>
  export default {
    name: 'DeleteUser',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      users: {
        type: Array,
        default: () => [],
      }
    },
    data: function () {
      return {
        showPopup: false,
      };
    },
    watch: {
      show: {
        immediate: true,
        handler: function() {
          this.showPopup = this.show;
        }
      },
      showPopup: function () {
        if(! this.showPopup) {
          this.$emit('close');
        }
      },
    },
    methods: {
      confirmDeletion: function () {
        this.$emit('delete', this.users);
      }
    }
  };
</script>

<style lang="scss">
  .create-challenge-container {
    .vs-popup {
      width: 400px;
      .vs-popup--header {
        height: 30px;
        .vs-popup--title {
          h3 {
            font-size: 16px;
            padding-top: 0;
            padding-bottom: 0;
          }
        }
        .vs-icon {
          padding: 5px;
          font-size: 15px;
        }
      }

      .vs-popup--content {
        margin: 0;
        overflow-x: hidden;
      }
    }
  }
</style>
