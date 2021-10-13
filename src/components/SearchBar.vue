<template>
  <vs-row class="width-100 text-align-left">
    <vs-input
      v-model="searchKeyword"
      placeholder="Search name, email or role"
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
