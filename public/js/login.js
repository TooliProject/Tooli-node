function loginUser() {
    let username = $("#user-name").val();
    $.post("/login", {
            username: username
        },
        function (data, status) {
            if (data && !data.err) {
                $("#loginFailedText").hide();
                window.location.href = "/";
            } else {
                $("#loginFailedText").show();

                if (data.err) {
                    $("#loginFailedText").html('Login failed:<br>' + data.err);
                }
            }
        }
    );
}