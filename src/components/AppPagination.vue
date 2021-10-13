<template>
  <vs-row
    vs-align="center"
    vs-justify="flex-end"
  >
    <div>
      <vs-icon
        class="fas fa-angle-left ph-5"
        :class="current === 1 ? 'default-cursor disabled' : 'hover:text-primary pointer-cursor'"
        @click="goBack"
      />
    </div>
    <div class="bg-lightgrey flex-box border-radius-50 bordered-dark ph-5">
      <div
        v-for="page in pages"
        :key="page"
        class="p-8"
        @click="selectCurrent(page)"
      >
        <span
          :class="parseInt(page) === parseInt(current) ?
            'text-primary default-cursor' : 'hover:text-primary pointer-cursor'"
        >
          {{ page }}
        </span>
      </div>
    </div>
    <div>
      <vs-icon
        class="fas fa-angle-right ph-5"
        :class="current === totalPages ? 'default-cursor disabled' : 'hover:text-primary pointer-cursor'"
        @click="goNext"
      />
    </div>
  </vs-row>
</template>

<script>
  export default {
    name: 'AppPagination',
    props: {
      total: {
        type: Number,
        default: 0
      },
      currentPage: {
        type: Number,
        default: 0
      },
      recordsPerPage: {
        type: Number,
        default: 5,
      }
    },
    data: function () {
      return {
        current: 0,
        totalPages: 0,
        pages: []
      };
    },
    watch: {
      total: {
        immediate: true,
        handler: function () {
          this.setupPagination();
        }
      }
    },
    methods: {
      setupPagination: function () {
        this.current = this.currentPage;
        this.totalPages = Math.ceil(this.total / this.recordsPerPage);
        this.pages = [];
        for(let page = 1; page <= this.totalPages; page++) {
          this.pages.push(page);
        }
      },
      goNext: function () {
        if(this.current < this.totalPages) {
          this.current++;
          this.updatePage();
        }
      },
      goBack: function () {
        if(this.current > 1) {
          this.current--;
          this.updatePage();
        }
      },
      selectCurrent: function (page) {
        this.current = page;
        this.updatePage();
      },
      updatePage: function () {
        this.$emit('change', this.current);
      }
    }
  };
</script>

<style scoped lang="scss">
  .disabled {
    opacity: 0.5;
  }
</style>
