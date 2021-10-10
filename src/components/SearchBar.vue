<template>
  <vs-row class="width-100">
    <vs-input
      v-model="searchKeyword"
      class="width-100"
      @input="emitEvent"
    />
  </vs-row>
</template>

<script>
  export default {
    name: 'SearchBar',
    data: function () {
      return {
        searchKeyword: '',
      };
    },
    methods: {
      emitEvent: function () {
        this.$emit('change', this.searchKeyword);
      }
    }
  };
</script>
