function add_subject(classnum, title, location, prof)
{
	subjectRef.child(semester).child(classnum).once('value', function(snapshot) {
		if (snapshot.val() != null)
			alert("데이터베이스에 존재하는 과목입니다.")
		else {
			subjectRef.child(semester).child(classnum).set({
				title : title,
				location : location,
				prof : prof
			})
			alert("데이터베이스에 과목정보를 저장했습니다.");
		}	
	})
}

function del_subject(classnum)
{
	subjectRef.child(semester).child(classnum).once('value', function(snapshot) {
		if (snapshot.val() == null)
			alert("데이터베이스에 존재하지 않는 과목입니다.")
		else {
			subjectRef.child(semester).child(classnum).remove()
			alert("데이터베이스에서 삭제했습니다.");
		}	
	})
}

function add_table(classnum)
{
	const user = firebase.auth().currentUser;
	const email = replaceAll(user.email, '.', '%');
	
	if (!user)
		alert("로그인 후 시도하세요.");
	else {
		tableRef.child(semester).child(email).once('value', function(snapshot) {
			if (snapshot.val() == null)
				var str = '';
			else {
				var str = snapshot.val();
			}
			if (str.indexOf(classnum) != -1)
				alert("이미 시간표에 추가된 과목입니다.");
			else {
				str = str + classnum + '|';
				tableRef.child(semester).child(email).set(str);
				alert("과목을 추가하였습니다.");
			}	
		})
	}
}

function del_table(classnum)
{
	const user = firebase.auth().currentUser;
	const email = replaceAll(user.email, '.', '%');
	
	if (!user)
		alert("로그인 후 시도하세요.");
	else {
		tableRef.child(semester).child(email).once('value', function(snapshot) {
			if (snapshot.val() == null)
				var str = '';
			else {
				var str = snapshot.val();
			}
			if (str.indexOf(classnum) == -1)
				alert("시간표에 없는 과목입니다.");
			else {
				str = replaceAll(str, classnum + '|', '');
				tableRef.child(semester).child(email).set(str);
				alert("과목을 삭제하였습니다.");
			}	
		})
	}
}
function get_student(classnum)
{
	var result = '';
	var data;
	tableRef.child(semester).once('value', function(snapshot){
		data = snapshot.val();
	}).then( function(){
		for (var key in data)
		{
			if (data[key].indexOf(classnum) != -1)
				result += key + '|';
		}
		console.log(result);
	})
}

function match_student(list, gender, age, mbti)
{
	const user = firebase.auth().currentUser;
	const user_email = replaceAll(user.email, '.', '%');

	var matched_list = '';
	var val;

	if (!user)
		alert("로그인 후 이용해주세요.");
	else {
		list = list.split('|');
		userRef.once('value', function(snapshot){
			val = snapshot.val();
		}).then(() => {
			for (i = 0; i < list.length - 1; i++){
				var email = list[i];
				var data = val[email];
				// check gender
				if (gender == '' || gender == data["gender"])
				{
					// check age
					if (age == 0 || age == data["age"])
					{
						//check mbti
						if ((mbti && checkmbti(data["mbti"])) || !mbti)
						{
							if (email != user_email)
								matched_list += email + '|';
						}
					}
				}
			}
			console.log(matched_list);
		})
	}
}

function set_condition(gender, age, stuID, mbti)
{
	const user = firebase.auth().currentUser;
	const user_email = replaceAll(user.email, '.', '%');

	if (!user)
		alert("로그인 후 이용해주세요.");
	else {
		conditionRef.child(user_email).set({
			gender : gender,
			age : age,
			stuID : stuID,
			mbti : mbti
		}).then(() => {
			alert("조건을 업데이트 했습니다.");
		})
	}
}

function checkmbti(mbti)
{
	const mbti_table = {
		'ENTJ' : 'INTJ|INTP|ENFP|INFJ|INFP|ESTP|ESFP|ISTP|ISFP', 
		'ENTP' : 'ENTP|INTJ|INTP|SETJ|SEFJ|ISTJ|ISFJ|ENFJ|INFJ|INFP', 
		'ENFJ' : 'ENTP|INTJ|INTP|ESFJ|ENFJ|INFJ|INFP|ESTP|ESFP|ISTP|ISFP', 
		'ENFP' : 'ENTJ|INTJ|INTP|ESTJ|ESFJ|ISTJ|ISFJ|ENFP|INFJ|ISFP', 
		'ESTJ' : 'ENTP|INTP|ESTJ|ISTJ|ISFJ|ENFP|INFP|ESFP|ISTP|ISFP', 
		'ESTP' : 'ENTJ|INTJ|ESFJ|ISTJ|ISFJ|ENFJ|INFJ|ESTP|ISTP|ISFP', 
		'ESFJ' : 'ENTP|INTP|ESFJ|ISTJ|ISFJ|ENFJ|ENFP|INFP|ESTP|ISTP|ISFP', 
		'ESFP' : 'ENTJ|INTJ|ESTJ|ISTJ|ISFJ|ENFJ|INFJ|ISTP|ISFP', 
		'INTJ' : 'ENTJ|ENTP|INTJ|ISTJ|ENFJ|ENFP|INFJ|INFP|ESTP|ESFP|ISTP|ISFP', 
		'INTP' : 'ENTJ|ENTP|INTP|ESTJ|ESFJ|ISTJ|ISFJ|ENFJ|ENFP|INFJ', 
		'INFJ' : 'ENTJ|ENTP|INTJ|INTP|ENFJ|ENFP|INFJ|ESTP|ESFP|ISTP|ISFP', 
		'INFP' : 'ENTJ|ENTP|INTJ|ESTJ|ESFJ|ISTJ|ISFJ|ENFJ|INFP', 
		'ISTJ' : 'INTJ|INTP|ESTJ|ESFJ|ISTJ|ENFP|INFP|ESTP|ESFP|ISFP', 
		'ISTP' : 'ENTJ|INTJ|ESTJ|ESFJ|ISFJ|ENFJ|INFJ|ESTP|ESFP', 
		'ISFJ' : 'ENTP|INTP|ESTJ|ESFJ|ENFP|INFP|ESTP|ESFP|ISTP', 
		'ISFP' : 'ENTJ|INTJ|ESTJ|ESFJ|ISTJ|ENFJ|ENFP|INFJ|ESTP|ESFP|ISFP'
	};
	const user = firebase.auth().currentUser;
	const user_email = replaceAll(user.email, '.', '%');
	var val;

	if (!user)
		alert("로그인 후 이용해주세요.")
	else {
		userRef.child(user_email).once('value', function(snapshot) {
			val = snapshot.val();
			user_mbti = val["mbti"];
		}).then(function() {
			if (mbti_table[user_mbti].indexOf(mbti) != -1)
			{
				console.log(1);
				return true;
			}
			else
			{
				console.log(0);
				return false;
			}
		});
	}
}

	// for (i = 0; i < list.length - 1; i++)
	// {
	// 	var email = list[i];
	// 	if (email != user_email)
	// 	{
	// 		userRef.child(email).once('value', function(snapshot){
	// 			val = snapshot.val();
	// 		}).then(function(){
	// 			// check gender
	// 			if (gender == '' || gender == val["gender"])
	// 			{
	// 				// check age
	// 				if (age == 0 || age == val["age"])
	// 				{
	// 					//check mbti
	// 					if (mbti == '' || mbti == val["mbti"])
	// 					{
	// 						console.log(email)
	// 						matched_list += email + '|';
	// 					}
	// 				}
	// 			}
	// 		})
	// 	}
	// }

function isEmail(email)
{
    return /@korea.ac.kr\s*$/.test(email);
}

function replaceAll(str, searchStr, replaceStr) {

	return str.split(searchStr).join(replaceStr);
}