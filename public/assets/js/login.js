$(document).ready(function () {
    $(".container").fadeIn(1000);
    $(".s2class").css({ "color": "#EE9BA3" });
    $(".s1class").css({ "color": "#748194" });
    $("#left").removeClass("left_hover");
    $("#right").addClass("right_hover");
    $(".signin").css({ "display": "none" });
    $(".signup").css({ "display": "" });
});
$("#right").click(function () {
    $("#left").removeClass("left_hover");
    $(".s2class").css({ "color": "#EE9BA3" });
    $(".s1class").css({ "color": "#748194" });
    $("#right").addClass("right_hover");
    $(".signin").css({ "display": "none" });
    $(".signup").css({ "display": "" });
});
$("#left").click(function () {
    $(".s1class").css({ "color": "#EE9BA3" });
    $(".s2class").css({ "color": "#748194" });
    $("#right").removeClass("right_hover");
    $("#left").addClass("left_hover");
    $(".signup").css({ "display": "none" });
    $(".signin").css({ "display": "" });
});