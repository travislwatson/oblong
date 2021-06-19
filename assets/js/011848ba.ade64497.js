(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[509],{299:function(e,n,t){"use strict";t.r(n),t.d(n,{frontMatter:function(){return i},metadata:function(){return u},toc:function(){return d},default:function(){return l}});var o=t(2122),r=t(9756),a=(t(7294),t(3905)),s=["components"],i={sidebar_position:3},u={unversionedId:"core/queries",id:"core/queries",isDocsHomePage:!1,title:"Queries",description:"Every front end application will need some amount of calculated information derived from the state. As a rule of thumb: if you can calculate it, _you should_. Keep your state as lean and normalized as is reasonable, and use queries for everything you can.",source:"@site/docs/core/queries.md",sourceDirName:"core",slug:"/core/queries",permalink:"/oblong/docs/core/queries",editUrl:"https://github.com/travislwatson/oblong/edit/master/website/docs/core/queries.md",version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Commands",permalink:"/oblong/docs/core/commands"},next:{title:"State",permalink:"/oblong/docs/core/state"}},d=[{value:"Syntax",id:"syntax",children:[{value:"Dependencies",id:"dependencies",children:[]},{value:"Query Body",id:"query-body",children:[]}]}],c={toc:d};function l(e){var n=e.components,t=(0,r.Z)(e,s);return(0,a.kt)("wrapper",(0,o.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Every front end application will need some amount of calculated information derived from the state. As a rule of thumb: ",(0,a.kt)("strong",{parentName:"p"},"if you can calculate it, ",(0,a.kt)("em",{parentName:"strong"},"you should"),".")," Keep your state as lean and normalized as is reasonable, and use queries for everything you can."),(0,a.kt)("h2",{id:"syntax"},"Syntax"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"const myQuery = O.query()\n  .with({ your, dependencies, here })\n  .as((o) => 'your result here')\n")),(0,a.kt)("h3",{id:"dependencies"},"Dependencies"),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},".with({ ... })")," call allows you to specify any dependencies your query has. Queries cannot depend on commands, only state and other queries."),(0,a.kt)("h3",{id:"query-body"},"Query Body"),(0,a.kt)("p",null,'Your query body is just a function with a special first argument: "little o." This special first argument will contain resolved versions of whatever dependencies you specify. Your query body must be a pure function: no side effects! It should only use the dependencies supplied, and it must always return a value.'))}l.isMDXComponent=!0}}]);