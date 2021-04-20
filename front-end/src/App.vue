<template>
<div id="app">
  <div class="logo">
    <img src="/logo/index.png">
  </div>
  <router-view />
  <div class="foot">  
    <footer>
        <p>Author: Alex Zapalac</p>
        <p><a href="https://github.com/alexzapalac/Final-Project">Github Repository</a></p>
        <p>This Project took around 12 hours</p>
    </footer>
  </div>
</div>
</template>

<style>
/* Color scheme: https://paletton.com/#uid=7040u0knHs+edG7jrvYscpiuCk2 */
/* red: #e74c3c
 * blue: #277E8E
 */
body {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  font-size: 13pt;
  margin: 0px 200px;
}

#header {
  /* Semi-circle */
  margin: 0 1em 1em 0;
  height: 100px;
  width: 200px;
  border-bottom-left-radius: 200px;
  border-bottom-right-radius: 200px;
  /* Fixed position */
  position: fixed;
  z-index: 10000;
  left: 50%;
  transform: translate(-50%, 0);
  /* Color and alignment */
  background: #e74c3c;
  text-align: center;
  box-shadow: 0 0 0 1em #FFF;
}

nav {
  display: flex;
  justify-content: center;
}

h1 {
  color: #fff;
  font-size: 18px;
}

h2 {
  font-size: 12px;
}

#header .fas {
  font-size: 25px;
  color: #fff;
  width: 50px;
}

.pure-button-primary {
  background-color: #277E8E;
}
.logo {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.logo img {
  border-width: 2px;
  border: blue;
}

.foot {
  margin-top: 50px;
  text-align: center;
}

.foot p {
  display: flex;
  justify-content: center;
}
</style>
