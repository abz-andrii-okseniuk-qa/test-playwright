const store=new Store({portName:"4873"});store.ready().then(()=>{injectFonts(),ReactDOM.render(React.createElement(ReactRedux.Provider,{store:store},React.createElement(MainComponent,{store:store})),document.getElementById("appcontainer"))});