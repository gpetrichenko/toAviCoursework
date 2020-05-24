<template>
  <div>
    <navigation />
    <main>
      <router-view />
    </main>
    <!-- <indexFooter /> -->
  </div>
</template>

<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import navigation from "./components/navigation";

export default {
  name: "App",
  components: {
    navigation,
  }
};
</script>
<style>
.featured__controls .ul .li a {
  color: #1C1C1C;
}


</style>
