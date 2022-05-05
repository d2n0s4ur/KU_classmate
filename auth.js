//----------------------( SIGNUP )----------------------//

$("#signupBtn").click(function () {
    // Get User Input
    var email = $('#emailInput').val().trim().toLowerCase();
	var stuID = parseInt($('#stuIDInput').val().trim());
    var pw = $('#pwInput').val().trim();
    var age = parseInt($('#ageInput').val().trim());
    var uname = $('#unameInput').val().trim();
    var mbtilist = document.getElementById('mbtiInput');
    var mbti = mbtilist.options[mbtilist.selectedIndex].value
    var genderlist = document.getElementById('genderInput')
    var gender = genderlist.options[genderlist.selectedIndex].value

    if (pw == "" || email == "" || stuID == "" || age == "" || uname == "" || mbti == "") {
        alert("모든 요소는 필수 입력입니다.");
    } else if (!isEmail(email)) {
        alert("고려대학교 이메일로만 가입이 가능합니다.")
    } else if (pw.length < 6 || pw.length > 21) {
        alert("비밀번호는 6 ~ 21자리만 가능합니다.")
    } else {
		userRef.child(stuID).once('value', function(snapshot) {
			if (snapshot.val() != null)
				alert("이미 존재하는 학번입니다.")
			else {
				var error = false;
				const promise = auth.createUserWithEmailAndPassword(email, pw);
				promise.catch(e => {
					alert("존재하는 email 입니다.");
					error = true;
				}).then(function () {
					if (!error) {
						var user = firebase.auth().currentUser;
						userRef.child(replaceAll(email, '.', '%')).set({
							stuID : stuID,
							age : age,
							gender : gender,
							name : uname,
							mbti : mbti
						})
					}
                    alert("회원가입에 성공하였습니다.");
                    location.href="./login.html"
				})
			}
		});
    }
});

function isEmail(email)
{
    return /@korea.ac.kr\s*$/.test(email);
}

function replaceAll(str, searchStr, replaceStr) {

	return str.split(searchStr).join(replaceStr);
}

//----------------------( Logout )----------------------//

$("#logoutBtn").click(function() {
    logout();
    location.href="./login.html";
})

function logout() {
    auth.signOut();
    localStorage.clear();
}

$("#loginBtn").click(function () {
    var email = $('#logEmail').val().trim();
    var pw = $('#logPw').val().trim();
    login(email, pw);
})

function login(email, pw) {
    const promise = auth.signInWithEmailAndPassword(email, pw);
    var fail = 0;
    promise.catch(e => {
        // Login fail
        fail = 1;
        alert("로그인에 실패했습니다.");
        location.href="./login.html"
    }).then(() => {
        if (fail == 0)
            location.href="./index.html"
    });
}