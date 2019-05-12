<template>
  <div class="container" :class="{'light-background': !isDarkMode, 'dark-background': isDarkMode}">
    <h2 :class="{'light-text': isDarkMode, 'dark-text': !isDarkMode}">Team</h2>
    <div class="cards">
      <transition
        appear
        appear-active-class="animated flipInX"
        v-for="(member, index) in members"
        :key="member.id"
      >
        <a
          class="card"
          :class="{'light-card': !isDarkMode, 'dark-card': isDarkMode, ['card-'+(index+1)]: true}"
        >
          <img
            :src="member.img"
            class="card-header"
            :class="{'light-header': !isDarkMode, 'dark-header': isDarkMode}"
          >
          <h3 :class="{'light-text': isDarkMode, 'dark-text': !isDarkMode}">{{member.title}}</h3>
          <p :class="{'light-text': isDarkMode, 'dark-text': !isDarkMode}">{{member.desc}}</p>
        </a>
      </transition>
    </div>
  </div>
</template>

<script>
import slack_img from "@/assets/slack.png";
import notion_img from "@/assets/notion.png";
import figma_img from "@/assets/figma.png";
import contentful_img from "@/assets/contentful.png";
import dropbox_img from "@/assets/dropbox.png";

export default {
  name: "Team",
  data() {
    return {
      members: [
        {
          img: slack_img,
          title: "slack",
          desc: "Messaging app for all team communication."
        },
        { img: notion_img, title: "Notion", desc: "All-in-one workspace." },
        {
          img: figma_img,
          title: "Figma",
          desc: "Collaborative design tool."
        },
        {
          img: contentful_img,
          title: "Contentful",
          desc: "Content management system."
        },
        {
          img: dropbox_img,
          title: "Dropbox",
          desc: "Storage space in the cloud."
        }
      ]
    };
  },
  computed: {
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    }
  }
};
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: space-evenly;
}

.card {
  width: 100%;
  max-width: 300px;
  height: 400px;
  margin: 20px;
  border-radius: 10px;
}
.light-card {
  background: $white;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.15);

  &:hover {
    box-shadow: 0px 30px 60px rgba(0, 0, 0, 0.35);
  }
}
.dark-card {
  background: $super-dark-blue;
  box-shadow: 0px 20px 40px rgba(255, 255, 255, 0.15);

  &:hover {
    box-shadow: 0px 30px 60px rgba(255, 255, 255, 0.35);
  }
}
.card-1 {
  animation-delay: 0s;
}
.card-2 {
  animation-delay: 0.5s;
}
.card-3 {
  animation-delay: 1s;
}
.card-4 {
  animation-delay: 1.5s;
}
.card-5 {
  animation-delay: 2s;
}

.card-header {
  width: 100%;
  border-radius: 10px 10px 0 0;
}
.light-header {
  background: $light-gray;
}
.dark-header {
  background: #283049;
}

h2 {
  @include heading-2;
  margin: 0;
  padding-left: 10px;
}
h3 {
  @include heading-3;
  margin-bottom: 16px;
  text-align: center;
}
p {
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  margin-left: 16px;
  margin-top: 0;
}
</style>