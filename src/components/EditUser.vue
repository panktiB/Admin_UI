<template>
  <vs-popup
    title="Edit"
    :active.sync="showPopup"
    icon-pack="fa5"
    icon-close="fas fa-times"
    class="create-challenge-container"
  >
    <div>
      <vs-row
        v-if="user && 'name' in user"
        class="pb-10"
      >
        <vs-input
          v-model="user['name']"
          placeholder="Enter a name"
          class="width-100"
        />
      </vs-row>
      <vs-row vs-justify="flex-end">
        <vs-button
          class="pv-5 ph-10"
          type="border"
          @click="saveInformation()"
        >
          Save
        </vs-button>
      </vs-row>
    </div>
  </vs-popup>
</template>

<script>
  export default {
    name: 'EditUser',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      editingUser: {
        type: Object,
        default: () => {},
      }
    },
    data: function () {
      return {
        showPopup: false,
        user: {}
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
    mounted () {
      this.user = this.deepCopy(this.editingUser);
    },
    methods: {
      saveInformation: function () {
        this.$emit('save', this.user);
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
