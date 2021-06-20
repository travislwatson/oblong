(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[771],{6236:function(e,t,a){"use strict";a.r(t),a.d(t,{frontMatter:function(){return s},metadata:function(){return u},toc:function(){return r},default:function(){return h}});var n=a(2122),o=a(9756),i=(a(7294),a(3905)),l=["components"],s={sidebar_position:1},u={unversionedId:"examples/click-game",id:"examples/click-game",isDocsHomePage:!1,title:"Click Game",description:"Let's build a counter game where we have to click the counter up fast enough to hit the max. You can see a complete and interactive version on StackBlitz. While this is a very simple example, the goal is to create an app and use all four CQSV pieces of Oblong... so let's get to it!",source:"@site/docs/examples/click-game.md",sourceDirName:"examples",slug:"/examples/click-game",permalink:"/oblong/docs/examples/click-game",editUrl:"https://github.com/travislwatson/oblong/edit/master/website/docs/examples/click-game.md",version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Little o",permalink:"/oblong/docs/core/little-o"}},r=[{value:"Setup",id:"setup",children:[]},{value:"The Game",id:"the-game",children:[{value:"State",id:"state",children:[]},{value:"Query",id:"query",children:[]},{value:"Command",id:"command",children:[]},{value:"View",id:"view",children:[]}]}],c={toc:r};function h(e){var t=e.components,a=(0,o.Z)(e,l);return(0,i.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Let's build a counter game where we have to click the counter up fast enough to hit the max. You can see a complete and interactive version ",(0,i.kt)("a",{parentName:"p",href:"https://stackblitz.com/edit/oblong-counter-game?file=index.tsx"},"on StackBlitz"),". While this is a very simple example, the goal is to create an app and use all four CQSV pieces of Oblong... so let's get to it!"),(0,i.kt)("h2",{id:"setup"},"Setup"),(0,i.kt)("p",null,"You'll need an Oblong app ready to go. You can use ",(0,i.kt)("a",{parentName:"p",href:"/oblong/docs/quick-start"},"Quick Start")," to set up a local Oblong app, or you can use ",(0,i.kt)("a",{parentName:"p",href:"https://stackblitz.com/edit/oblong-counter-game-starter?file=home.tsx"},"this Stackblitz")," as a starting point."),(0,i.kt)("h2",{id:"the-game"},"The Game"),(0,i.kt)("p",null,"The above code got us an Oblong app ready to go, but now it's time to actually code the game!"),(0,i.kt)("h3",{id:"state"},"State"),(0,i.kt)("p",null,'Our game will need to store how many "hits" we currently have. For this we use state:'),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"const hitCount = O.state('myGame.hitCount').as(0)\n")),(0,i.kt)("p",null,'You can read this as "I want to store some ',(0,i.kt)("inlineCode",{parentName:"p"},"number")," state in the Redux tree at ",(0,i.kt)("inlineCode",{parentName:"p"},"myGame.hitCount")," with a default value of ",(0,i.kt)("inlineCode",{parentName:"p"},"0"),'."'),(0,i.kt)("h3",{id:"query"},"Query"),(0,i.kt)("p",null,"We are going to need to calculate whether or not we've completed the game. We are going to do this simply based on the hitCount."),(0,i.kt)("p",null,"That is exactly what query is made for:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"const isPlaying = O.query()\n  .with({ hitCount }) // \u2b05 Dependency Injection! \ud83c\udf89\n  .as((o) => o.hitCount < 10)\n")),(0,i.kt)("p",null,"Queries are reactive, they will watch their dependencies and recalculate only when they need to. Efficient!"),(0,i.kt)("h3",{id:"command"},"Command"),(0,i.kt)("p",null,'A game is going to be boring if you can\'t interact with it. Here we let the user "hit," but it only lasts for 2 seconds. You can see that unlike redux-thunk calculated values like ',(0,i.kt)("inlineCode",{parentName:"p"},"o.isPlaying")," and the state values like ",(0,i.kt)("inlineCode",{parentName:"p"},"o.hitCount")," are live, no need to worry about stale values, and asynchronous works exactly as you expect!"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"const hit = O.command()\n  .with({ hitCount, isPlaying })\n  .as((o) => {\n    if (o.isPlaying) {\n      o.hitCount = o.hitCount + 1 // \u2b05 That's actually immutable Redux! \ud83d\udcaa\n\n      // A hit only lasts for 2 seconds\n      setTimeout(() => {\n        if (o.isPlaying) {\n          o.hitCount = o.hitCount - 1\n        }\n      }, 2000)\n    }\n  })\n")),(0,i.kt)("h3",{id:"view"},"View"),(0,i.kt)("p",null,"Now that your value, calculations, and interactivity are broken out away from your actual UI (as they should be \ud83d\ude09), views can focus on what they do best! Let's redefine our Home component with an actual Oblong view:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},'export const Home = O.view()\n  .with({ hitCount, hit, isPlaying })\n  .as((o) => (\n    <>\n      <button onClick={o.hit} disabled={!o.isPlaying}>\n        \ud83d\udc4a\n      </button>\n      <label>{o.isPlaying ? `${o.hitCount} clicks` : `You won!`}</label>\n      <progress max="10" value={o.hitCount} />\n    </>\n  ))\n')),(0,i.kt)("p",null,"And that's it, your first Oblong application! \ud83e\udd73 If low boilerplate Redux, natural language fluent api, full React and Redux compatibility, built-in state-based routing, and dependency injection weren't enough, this is your friendly reminder that Oblong is a Typescript framework. The application we just built in this quick start is 100% fully typed through inference, without a single type definition!"))}h.isMDXComponent=!0}}]);