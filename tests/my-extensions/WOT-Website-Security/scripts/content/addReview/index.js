{const e=new Store({portName:"4873"});e.ready().then(()=>{ReactDOM.render(React.createElement(ReactRedux.Provider,{store:e},React.createElement(AddReviewComponent,{store:e})),document.body)})}