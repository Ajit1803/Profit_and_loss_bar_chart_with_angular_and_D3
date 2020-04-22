# Profit_and_loss_bar_chart_with_angular_and_D3
Customised stacked bar chart with D3 and angular

This graph is built with angular and D3. Please don't forget to run the npm command for installing the D3 library into your node modules.

Few steps to create the graph

1. Create a service file which will contain the data or method to call the data and subscribe the same in your component
2. Once in the component you get your data, bind it with the property which can be passed on to the child component which will contain the graph
3. Depending on situation, if the graph is needed to be shown from before then do the subscription in ngOnInit method or else if not, then it can be done on the click of a button or tab.
4. Use the angular's input/output decorator to communicate between parent and child component.
