(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[180],{6731:function(e,t,a){"use strict";a.r(t),a.d(t,{frontMatter:function(){return l},metadata:function(){return r},toc:function(){return u},default:function(){return p}});var n=a(2122),s=a(9756),o=(a(7294),a(3905)),i=["components"],l={sidebar_position:4},r={unversionedId:"core/state",id:"core/state",isDocsHomePage:!1,title:"State",description:"State is best imagined as a couplet: a getter and a setter. The getter is observable to serve as a reactive trigger. The setter is simply a mutation... an assignment.",source:"@site/docs/core/state.md",sourceDirName:"core",slug:"/core/state",permalink:"/oblong/docs/core/state",editUrl:"https://github.com/travislwatson/oblong/edit/master/website/docs/core/state.md",version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Queries",permalink:"/oblong/docs/core/queries"},next:{title:"Views",permalink:"/oblong/docs/core/views"}},u=[{value:"Syntax",id:"syntax",children:[{value:"State Path",id:"state-path",children:[]},{value:"Default Value",id:"default-value",children:[]}]},{value:"Usage",id:"usage",children:[]},{value:"Equality Checking",id:"equality-checking",children:[]},{value:"Unit Testing",id:"unit-testing",children:[]}],c={toc:u};function p(e){var t=e.components,a=(0,s.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"State is best imagined as a couplet: a getter and a setter. The getter is observable to serve as a reactive trigger. The setter is simply a mutation... an assignment."),(0,o.kt)("h2",{id:"syntax"},"Syntax"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"const name = O.state('user.profile.name').as('Travis')\n")),(0,o.kt)("h3",{id:"state-path"},"State Path"),(0,o.kt)("p",null,"In the above example, you see ",(0,o.kt)("inlineCode",{parentName:"p"},"user.profile.name"),". This might look like an object accessor, and that's not a coincidence. Oblong uses Redux which is a single object state, so the path provided tells Oblong where to store the value. In this example, if we change the name to ",(0,o.kt)("inlineCode",{parentName:"p"},"John")," and have nothing else stored, our Redux state tree will look like:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "user": {\n    "profile": {\n      "name": "John"\n    }\n  }\n}\n')),(0,o.kt)("h3",{id:"default-value"},"Default Value"),(0,o.kt)("p",null,"If you're used to Redux, one unusual thing to how State works is that the default value is not stored. Regardless of how many pieces of State you define, your Redux tree will be empty until you start making mutations."),(0,o.kt)("p",null,"A logical conclusion to this is if the default value is just a calculation, can it be a query? Yes!"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"const defaultName = O.query()\n  .with({ gender })\n  .as((o) => (o.gender === 'male' ? 'John Doe' : 'Jane Doe'))\n\nconst name = O.state('name').as(defaultName)\n")),(0,o.kt)("p",null,"This is also your solution to computationally expensive default state values."),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("p",null,"When using State, just use normal assignment syntax:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"const MyView = O.view()\n  .with({ name })\n  .as((o) => (\n    <input\n      value={o.name}\n      onChange={(e) => {\n        o.name = e.target.value\n      }}\n    />\n  ))\n")),(0,o.kt)("p",null,"If your piece of state is an object or array, you will not be able to mutate it. You can use an immutable update pattern such as:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"o.people = [...o.people, newPerson]\n")),(0,o.kt)("p",null,"The Immer library can also a great fit:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import produce from 'immer'\n\no.people = produce(o.people, (draftState) => {\n  draftState.push(newPerson)\n})\n")),(0,o.kt)("h2",{id:"equality-checking"},"Equality Checking"),(0,o.kt)("p",null,"To prevent unnecessary chatter, State mutations go through an equality check. If the new value is the same according to the equality function, then the mutation is skipped."),(0,o.kt)("p",null,"There are three built-in checkers:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},'"exact" performs a ',(0,o.kt)("inlineCode",{parentName:"li"},"===")," check and is the default"),(0,o.kt)("li",{parentName:"ul"},'"never" will disable this optimization entirely and always log a mutation change'),(0,o.kt)("li",{parentName:"ul"},'"shallow" goes one level deep into your object or array and will check for strict ',(0,o.kt)("inlineCode",{parentName:"li"},"===")," equality at that level")),(0,o.kt)("p",null,"You can also specify your own function:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"O.state('myState')\n  .setEquality((a, b) => a === b)\n  .as({})\n")),(0,o.kt)("h2",{id:"unit-testing"},"Unit Testing"),(0,o.kt)("p",null,"TODO, mocking helper"))}p.isMDXComponent=!0}}]);