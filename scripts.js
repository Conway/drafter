let names = [];

$(document).ready(() => {
    names = JSON.parse(localStorage.getItem("names")) || [];
    $("#names").val(names.join("\n"));
    redraw();
});

$("#saveNames").click(() => {
  names = $("#names").val().split("\n");
  redraw();
  $("#editNamesModal").modal('hide');
});

$("#shuffle").click(async () => {
  $.confirm ({
    theme: 'supervan',
    title: 'Shuffle',
    content: 'Are you sure you want to shuffle?',
    escapeKey: 'Cancel',
    buttons: {
      Shuffle: {
        btnClass: 'btn-default shuffle'
      },
      Cancel: () => {}
    }
  })
});

$("#reverse").click(() => {
  $.confirm ({
    theme: 'supervan',
    title: 'Reverse',
    content: 'Are you sure you want to reverse?',
    escapeKey: 'Cancel',
    buttons: {
      Reverse: {
        text: 'Reverse',
        action: () => {
          names.reverse();
          redraw();
        },
        keys: ['enter']
      },
      Cancel: () => {}
    }
  })
});

$("#shortlist").click(() => {
  nameAsStr = '<span class="shortlist"><ol>';
  names.forEach(name => {
    nameAsStr += "<li>" + name + "</li>"
  });
  nameAsStr += "</ol></span>";
  $.confirm ({
    theme: 'bootstrap',
    title: 'Order',
    content: nameAsStr,
    buttons: {Close: () => {}}
  });
});

drop = id => {
  console.log(id);
  let name = names[id];
  $.confirm({
    title: 'Are you sure?',
    content: 'Are you sure you want to move ' + name + '?',
    escapeKey: 'No',
    buttons: {
      Yes: {
        text: 'Yes',
        action: () => {
          names.splice(id, 1);
          names.push(name);
          redraw();
        },
        keys: ['enter']
      },
      No: () => {}
    }
  });
};


$(document).on("click", ".shuffle", () => {
  shuffle();
});

shuffle = () => {
  var loading = $.alert({
      lazyOpen: true,
      title: "Loading",
      content: "Now Shuffling...",
      buttons: {}
  });
  loading.open()
  $("body").addClass("loading");
  for (let k = 0; k < 2500; k++) {
    sleep(50).then(() => {
      for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
      }
      redraw();
    });
  }
  loading.close();
}

redraw = () => {
  localStorage.setItem("names", JSON.stringify(names));
  $("#tbody").empty();
  names.forEach((name, i) => {
    $("#namesTable tbody").append('<tr><th scope="row" class="id">' + (i+1) + '</th><td class="name">' + name + '</td><td><button class="btn btn-primary py-0 move" onclick="drop(' + i + ')">&darr;</button></td></tr>');
  });

}

sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
