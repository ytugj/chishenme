$(function() {
  $("#start, #stop, #next, #confirm").off("click");

  let easterEggCount = 0;
  let easterEggTriggered = false;
  let timer = null;
  let currentFood = "";
  let foods = [];

  function getFoodList() {
    return $("#list").val().replace(/ +/g, " ").replace(/^ | $/g, "").split(" ");
  }

  function randomFood(list) {
    var r = Math.floor(Math.random() * list.length);
    return list[r];
  }

  function showFloatingFood(food) {
    var rTop = Math.ceil(Math.random() * $(document).height());
    var rLeft = Math.ceil(Math.random() * ($(document).width() - 50));
    var rSize = Math.ceil(Math.random() * (37 - 14) + 14);
    $("<span class='temp'></span>")
      .html(food)
      .hide()
      .css({
        top: rTop,
        left: rLeft,
        color: "rgba(0,0,0,." + Math.random() + ")",
        fontSize: rSize + "px",
        position: "absolute",
        zIndex: 9999
      })
      .appendTo("body")
      .fadeIn("slow", function() {
        $(this).fadeOut("slow", function() {
          $(this).remove();
        });
      });
  }

  function updateDisplay(food, withFloat) {
    $("#what").html(food);
    if (withFloat !== false) {
      showFloatingFood(food);
    }
  }

  function startSpinning() {
    if (easterEggTriggered) return;
    if (timer) clearInterval(timer);
    timer = setInterval(function() {
      var newFood = randomFood(foods);
      currentFood = newFood;
      updateDisplay(newFood, true);
    }, 50);
    $("#start").hide();
    $("#stop").show();
    $("#next, #confirm").hide();
  }

  function stopSpinningAndShowButtons() {
    if (easterEggTriggered) return;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    $("#stop").hide();
    $("#next").show();
    $("#confirm").show();
  }

  function restartSpinning() {
    if (easterEggTriggered) return;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    currentFood = randomFood(foods);
    updateDisplay(currentFood, true);
    timer = setInterval(function() {
      var newFood = randomFood(foods);
      currentFood = newFood;
      updateDisplay(newFood, true);
    }, 50);
    $("#next, #confirm").hide();
    $("#stop").show();
  }

  function handleEasterEgg() {
    if (easterEggTriggered) return;
    easterEggCount++;
    if (easterEggCount >= 6) {
      easterEggTriggered = true;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      $("#start, #stop, #next, #confirm").hide();
      $("<input type='button' class='inline-flex w-full justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 sm:ml-3 sm:w-auto' value='停止' id='easterStop'>").insertAfter("#confirm");
      $("#easterStop").click(function() {
        alert("这么作？今天别吃了！");
        $(this).hide();
      });
    }
  }

  foods = getFoodList();
  if (foods.length) currentFood = foods[0];
  updateDisplay(currentFood, false);
  $("#stop, #next, #confirm").hide();
  $("#start").show();

  $("#start").click(function() {
    if (easterEggTriggered) return;
    handleEasterEgg();
    if (!timer && !easterEggTriggered && $("#start").is(":visible")) {
      foods = getFoodList();
      if (foods.length === 0) return;
      currentFood = foods[0];
      startSpinning();
    }
  });

  $("#stop").click(function() {
    if (easterEggTriggered) return;
    handleEasterEgg();
    if (timer) {
      stopSpinningAndShowButtons();
    }
  });

  $("#next").click(function() {
    if (easterEggTriggered) return;
    restartSpinning();
  });

  $("#confirm").click(function() {
    if (easterEggTriggered) return;
    if (timer) clearInterval(timer);
    window.location.href = "date.html?food=" + encodeURIComponent(currentFood);
  });
});