/*
 * GET-STARTED
 */


function getStartedScrollView() {
  return {
      horizontal: true,
      pagingEnabled: true,
      backgroundColor: "#02b7cc",
      flexDirection: 'row',
  };
}

var styles = {
  step: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 450,
    flex: 1,
    marginBottom: 100,
    width: 360,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 100
  },
  title: {
    color: "#fff",
    fontSize: 21,
    textAlign: 'center',
    marginBottom: 5,
  },
  desc: {
    color: "rgba(255,255,255, 0.8)",
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 21
  },
}

function showGetStarted(params, context) {

  var steps = [
    {
      title: "Welcome to WhoPays",
      desc: "Someone from your group creates a list and invites the other users",
      image: "https://status.im/img/crowdsale/phone@2x.png",
      image_width: 240,
      image_height: 200,
    },
    {
      title: "Create a list",
      desc: "Someone from your group creates a list and invites the other users",
      image: "https://ethdeveloper.com/static/get-started-1.png",
      image_width: 128,
      image_height: 128,
    },
    {
      title: "Add expenses",
      desc: "Everyone from the group can add their expenses to the list",
      image: "https://ethdeveloper.com/static/get-started-2.png",
      image_width: 128,
      image_height: 128,
    },
    {
      title: "Close the list",
      desc: "At the end of the week the person who created the list can close the list. Everyone gets notified if they have to pay and how much.",
      image: "https://ethdeveloper.com/static/get-started-3.png",
      image_width: 128,
      image_height: 128,
    },
    {
      title: "Transfer Ether",
      desc: "Every person who needs to pay, transfers Ether to the list. The list keeps track of who paid.",
      image: "https://ethdeveloper.com/static/get-started-4.png",
      image_width: 128,
      image_height: 128,
    },
    {
      title: "Done!",
      desc: "Once everyone paid. The list will transfer Ether automatically to the persons who are still owed Ether. The list will be resolved.",
      image: "https://ethdeveloper.com/static/get-started-5.png",
      image_width: 128,
      image_height: 128,
    }
  ];

  var screens = steps.map(function (step) {
      return status.components.view(
        styles.step,
        [
          status.components.image(
            {
                source: {uri: step.image},
                style: {
                    width: step.image_width,
                    height: step.image_height,
                    marginBottom: 20,
                }
            }
          ),
          status.components.text(
            { style: styles.title },
            step.title
          ),
          status.components.text(
            { style: styles.desc },
            step.desc
          )
        ]
      );
  });

  var view = status.components.scrollView(
    getStartedScrollView(),
    screens
  );

  return {
    title: "Get started",
    dynamicTitle: false,
    singleLineInput: true,
    markup: view
  };
}

status.command({
  name: "get-started",
  title: "get-started",
  registeredOnly: true,
  description: "Shows a short intro describing WhoPays",
  color: "#02ccba",
  fullscreen: true,
  onSend: showGetStarted
});


/*
 * CREATE LIST
 */

var create = {
  name: "create",
  title: "Create list",
  icon: "smile",
  registeredOnly: true,
  description: "Create a list",
  color: "#02ccba",
  params: [{
    name: "create",
    type: status.types.TEXT,
    placeholder: "Add your list name"
  }],
  preview: function (params) {
    return {
        markup: status.components.view({}, [
          status.components.text({
            style: {
              marginTop: 5,
              marginHorizontal: 0,
              fontSize: 14,
              color: "#111111"
            }
          }, "You've successfully created a list named"),
          status.components.text({
            style: {
              marginHorizontal: 0,
              fontSize: 14,
              fontWeight: 'bold',
              color: "#111111",
            }
          }, params.create + "."),
        ])
      }
    },
  handler: function(params) {
    if (localStorage.getItem("list")) {
      localStorage.setItem("list", localStorage.getItem("list") + "," + params.create);
    } else {
      localStorage.setItem("list", params.create);
    }
  }
}

status.command(create);

/*
 * REMOVE LIST
 */

function suggestionsContainerStyle(suggestionsCount) {
  return {
      marginVertical: 1,
      marginHorizontal: 0,
      keyboardShouldPersistTaps: "always",
      height: Math.min(150, (56 * suggestionsCount)),
      backgroundColor: "white",
      borderRadius: 5,
      flexGrow: 1
  };
}

var suggestionSubContainerStyle = {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001f"
};

var valueStyle = {
    marginTop: 9,
    fontSize: 14,
    fontFamily: "font",
    color: "#000000de"
};


function addUserSuggestions() {
    var lists = localStorage.getItem("list").split(',');
    var suggestions = lists.map(function(entry) {
        return status.components.touchable(
            {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT,[0, entry]])},
            status.components.view(
                suggestionsContainerStyle,
                [status.components.view(
                    suggestionSubContainerStyle,
                    [
                        status.components.text(
                            {style: valueStyle},
                            entry
                        )
                    ]
                )]
            )
        );
    });

    // Let's wrap those two touchable buttons in a scrollView
    var view = status.components.scrollView(
        suggestionsContainerStyle(lists.length),
        suggestions
    );

    // Give back the whole thing inside an object.
    return {markup: view};
}


status.command({
  name: "add-user",
  title: "Add user",
  registeredOnly: true,
  description: "Add a user to a list",
  color: "#02ccba",
  sequentialParams: true,
  params: [{
    name: "add-user",
    type: status.types.TEXT,
    placeholder: "Select list",
    suggestions: addUserSuggestions
  },
  {
    name: "add-user-to-list",
    type: status.types.TEXT,
    placeholder: "Add user"
  }],
});

/*
 * ADD USER
 */

function suggestionsContainerStyle(suggestionsCount) {
  return {
      marginVertical: 1,
      marginHorizontal: 0,
      keyboardShouldPersistTaps: "always",
      height: Math.min(150, (56 * suggestionsCount)),
      backgroundColor: "white",
      borderRadius: 5,
      flexGrow: 1
  };
}

var suggestionSubContainerStyle = {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001f"
};

var valueStyle = {
    marginTop: 9,
    fontSize: 14,
    fontFamily: "font",
    color: "#000000de"
};


function addUserSuggestions() {
    var lists = localStorage.getItem("list").split(',');
    var suggestions = lists.map(function(entry) {
        return status.components.touchable(
            {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT,[0, entry]])},
            status.components.view(
                suggestionsContainerStyle,
                [status.components.view(
                    suggestionSubContainerStyle,
                    [
                        status.components.text(
                            {style: valueStyle},
                            entry
                        )
                    ]
                )]
            )
        );
    });

    // Let's wrap those two touchable buttons in a scrollView
    var view = status.components.scrollView(
        suggestionsContainerStyle(lists.length),
        suggestions
    );

    // Give back the whole thing inside an object.
    return {markup: view};
}


status.command({
  name: "add-user",
  title: "Add user",
  registeredOnly: true,
  description: "Add a user to a list",
  color: "#02ccba",
  sequentialParams: true,
  params: [{
    name: "add-user",
    type: status.types.TEXT,
    placeholder: "Select list",
    suggestions: addUserSuggestions
  },
  {
    name: "add-user-to-list",
    type: status.types.TEXT,
    placeholder: "Add user"
  }],
});


/*

function createScrollView() {
  return {
      horizontal: true,
      pagingEnabled: true,
      backgroundColor: "#02b7cc",
      flexDirection: 'row',
  };
}


function showCreate() {

  var view = status.components.scrollView(
    createScrollView(),
    [status.components.view({},[
      status.components.view({},[
        status.components.text({
          style: {
            marginTop: 5,
            marginHorizontal: 0,
            fontSize: 14,
            color: "#111111"
          }
        }, "test"),
        status.components.text({
          style: {
            marginTop: 5,
            marginHorizontal: 0,
            fontSize: 14,
            color: "#111111"
          }
        }, web3.eth.accounts[0]),
        status.components.touchable(
          { onPress: status.components.dispatch([status.events.SET_VALUE, "/add-to-list "]) },
          status.components.view(
              { style: createStyles.addButton },
              [status.components.view(
                  {},
                  [
                      status.components.text(
                          { style: createStyles.addButtonText },
                          "Add address"
                      )
                  ]
              )]
          )),
      ])
    ])]
  );


  return {
    title: "Create a list",
    dynamicTitle: false,
    singleLineInput: true,
    markup: view
  };
}

  /*
    // Empty the users list, since we're creating a new one
    web3.db.putString("users", "users", "");
    showCreate();
  }


/*


// /create "List name"
// List created, this is the actionable message (Click here to add users)

// give name
// add users
// Create
// Make contract
*/
