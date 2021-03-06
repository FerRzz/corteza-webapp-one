<template>
  <div
    v-if="displayed"
    class="selector app-list"
    :class="fullscreen?'fullscreen':'tabbed'"
  >
    <span
      v-if="!firstApp"
      class="new-app-closer"
      @click="$emit('close')"
    ><i class="icon-x" /></span>
    <!--<section class="app-section popular">
      <div class="section-title">Most popular</div>
      <ul :class="[ 'available-apps' ]">
        <li
          v-for="(appIndex, index) in popular_apps"
          :class="[ 'available-app' ]"
          :key="index">
          <AppSelectorItem
            :crustapp="available_apps[appIndex]"
            :paneId="paneId"
            :appIndex="appIndex"
            v-on:doadd="addApp(available_apps[appIndex], paneId)"/>
        </li>
      </ul>
    </section>-->
    <section class="app-section available">
      <div class="section-title">
        {{ $t('app.general.availableApps') }}
      </div>
      <ul :class="[ 'available-apps' ]">
        <li
          v-for="(crustapp, index) in available_apps"
          :key="index"
          :class="[ 'available-app' ]"
        >
          <app-selector-item
            :crustapp="crustapp"
            :pane-id="paneId"
            :app-index="index"
            @doadd="addApp(crustapp, paneId)"
          />
        </li>
      </ul>
    </section>
    <modal
      v-if="chooseDisposition"
      :title="$t('app.general.availableApps')"
      @close="addApp"
    >
      <div class="chooseDisposition">
        <ul class="split2ways">
          <li class="h" />
        </ul>
      </div>
    </modal>
  </div>
</template>

<script>
import Modal from 'corteza-webapp-one/src/components/Modal'
import AppSelectorItem from 'corteza-webapp-one/src/components/AppSelectorItem'

// @todo this component is loaded 6 times due to improper implementation, rewrite
export default {
  directives: {},

  components: {
    Modal,
    AppSelectorItem,
  },

  props: {
    paneId: {
      type: Number,
      required: false,
      default: null,
    },
    displayed: {
      type: Boolean,
      required: false,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      required: false,
      default: false,
    },
    // if true this is the first app we add,
    // we cannot close the app window selection
    // and we do not need to ask disposition.
    firstApp: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data: function () {
    return {
      // if this is not the first app we will use this structure to
      // add data need to add the tab (chosen orientation and position)
      app_to_add: null,
      chooseDisposition: false,
      // app struct
      // must have name,
      // may have color (defaults to $appgrey)
      // may have icon (has precedence over images)
      // may have an image, if no image nor icon,text will take the whole space.
      // may have an array specifiying in what context the app can be opened, if unspecified will default "window"
      // allowed contexts are :
      //  - window (default) allows to be opened in new window, if other modes available a selection tooltip will alow to choose how to open.
      //  - tab : can be opened in tabs
      //  - external : specific for apps or executables
      //  - panel : can be opened in crust context
      // if apps can be opened in tabs they will be listed via the "+" in a panel context
      // if apps can be opened in panel/window or external they will be listed via the "+" in header
      available_apps: [],
    }
  },

  created () {
    this.$SystemAPI.applicationList().then(({ set }) => {
      this.available_apps = set.map(a => {
        return { ...a, ...a.unify }
      }).filter(a => a.listed)
    })
  },

  methods: {
    // no fat arrow
    // https://stackoverflow.com/a/43073924
    addApp: function (availableApp, paneId) {
      // if we have a paneId,
      // nothing to do, just send add-app
      // otherwise we need to know how to dispose panes,
      // if this is not the first app.
      if (!this.firstApp && paneId === null) {
        this.chooseDisposition = true
        return
      }
      this.$emit('add-app', {
        app: availableApp,
        paneId: paneId,
      })
    },
  },
}
</script>

<style scoped lang="scss">
  .new-app-closer {
    position: fixed;
    top: 10px;
    right: 15px;
    font-size: 32px;
  }

  .app-list {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: $white;
    font-family: $regular;
    font-size: 10px;
    box-sizing: border-box;
    z-index: 99;
    overflow: hidden auto;
    padding-bottom: 30px;

    * {
      font-family: $regular;
      box-sizing: border-box;
    }

    .available-apps {
      list-style: none;
      padding: 10px;
      clear: both;
    }
  }

  .available-app {
    display: block;
    width: calc(50% - 10px);
    max-width: 180px;
    height: 115px;
    background-color: $white;
    float: left;
    margin: 5px;
    border-radius: 3px;
  }

  .section-title {
    font-size: 2.5em;
    margin-top: 50px;
    padding: 20px 15px 10px 15px;
    text-align: center;
    clear: both;
  }

  @media (min-width: $wideminwidth) {
    .section-title {
      padding-top: 60px;
    }

    .app-section {
      max-width: 4*(180px + 5px + 10px); // app width + margin + list padding
      margin: 0 auto;
    }
  }
</style>
