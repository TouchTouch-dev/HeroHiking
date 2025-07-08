document.addEventListener('DOMContentLoaded', function() {
    const donationAmountSelect = document.getElementById('donationAmount');
    const totalDonationAmountSpan = document.getElementById('totalDonationAmount');
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const submitButton = document.getElementById('submitButton');
    const agreeAllCheckbox = document.getElementById('agreeAll');
    const termsCheckboxes = document.querySelectorAll('.terms-agreement input[type="checkbox"]');
    const requiredTermsCheckbox = document.querySelector('.terms-agreement input[data-required="true"]');

    // 모달 관련 요소
    const termsModal = document.getElementById('termsModal');
    const closeButton = document.querySelector('.close-button');
    const termsContentDiv = document.getElementById('termsContent');
    const viewTermsLinks = document.querySelectorAll('.view-terms');

    let selectedDonation = 0; // 초기 후원 금액은 0
    totalDonationAmountSpan.textContent = selectedDonation.toLocaleString(); // 초기 표시

    // 이용약관 내용 (필요에 따라 더 많은 약관 내용을 객체에 추가)
    const termsData = {
        terms1: `
            <p><strong>1. 수집 · 이용 항목</strong></p>
            <p><strong>① 후원신청</strong></p>
            <ul>
                <li>회원 유형, 이름, 성별, 생년월일, 휴대전화번호, 정기 후원 여부, 후원회비 금액, 후원분야의 지리적 정보(국 · 내외)</li>
                <li>(만 14세 미만 아동의 후원 신청시) 패스(PASS) 서비스로 본인인증하는 경우 법정대리인의 성명, 휴대전화번호 / 문자메시지로 본인인증하는 경우 법정대리인의 성명, 휴대전화번호, 생년월일, 성별</li>
            </ul>
            <p><strong>② 후원회비 결제</strong></p>
            <ul>
                <li>자동이체 선택시 : 은행명, 계좌번호, 예금주의 성명 · 생년월일 · 휴대폰번호, 출금일, 전자서명 또는 ARS 인증 정보</li>
                <li>신용카드 선택시 : 카드사명, 카드번호, 유효기간, 카드 비밀번호의 앞 두자리, 카드 소유자의 성명 · 생년월일 · 휴대전화번호</li>
                <li>지로(ORC) : 주소, 휴대전화번호</li>
                <li>간편결제 선택시 : 결제수단</li>
            </ul>
            <p><strong>③ 기부금영수증 신청</strong></p>
            <ul>
                <li>개인 후원회원의 이름, 주소</li>
                <li>법인 후원회원의 사업자등록번호, 주소</li>
            </ul>
            <p>※ 개인후원회원의 주민등록번호는 [소득세법] 제160조의4 및 동법시행력 제208조의3, [법인세법] 제112조의2, 동법시행령 제155조의2에 의거하여 수집합니다.</p>
            <p><strong>2. 수집 · 이용 목적</strong></p>
            <p>본인확인, 후원회비 결제, 후원 관리 업무, 상담문의 처리, 법정대리인의 동의 확인 등</p>
            <p><strong>3. 보유 · 이용기간</strong></p>
            <ul>
                <li>① 후원 신청 정보 : 후원종결 · 철회시로부터 5년</li>
                <li>② 후원회비 결제 정보 : 목적달성시 또는 법정 의무 보유기간까지</li>
            </ul>
            <p><strong>4. 동의 거부에 대한 안내</strong></p>
            <p>귀하는 동의를 거부하실 수 있으나, 거부시 후원회원 가입이 불가능합니다.</p>
            <p>※ 상세한 내용은 개인정보 처리방침을 참고하여 주십시오.</p>
        `,
        terms2: `
            <p>마침표(이하 ‘재단’)이 다음과 같이 개인정보를 수집하여 이용하는데 동의합니다.</p>
            <p><strong>1. 수집 · 이용 항목</strong></p>
            <p>이름, 휴대전화번호</p>
            <p>(만 14세 미만 아동의 후원 신청시 법정대리인의 이름, 휴대전화번호)</p>
            <p><strong>2. 수집ㆍ이용 목적</strong></p>
            <p>마침표의 사업소개, 캠페인 참여 및 후원 요청 등</p>
            <p><strong>3. 보유ㆍ이용기간</strong></p>
            <p>수신동의 철회시까지</p>
            <p><strong>4. 동의 거부에 대한 안내</strong></p>
            <p>귀하는 동의를 거부할 권리가 있으며, 거부하시더라도 후원신청이 가능합니다. 다만, 거부 시 마침표의 사업소개 및 후원캠페인 안내 등 다양한 정보를 받지 못할 수 있습니다.</p>
            <p><strong>5. 동의 후 철회에 대한 안내</strong></p>
            <p>동의하신 후에도 무료거부전화(080-080-0880) 또는 마이페이지를 통해 언제든지 철회하실 수 있습니다.</p>
        `
        // 다른 약관 내용이 있다면 여기에 추가
    };

    // 후원 금액 드롭다운 변경 이벤트
    donationAmountSelect.addEventListener('change', function() {
        if (this.value) { // "선택" 옵션이 아닐 경우
            selectedDonation = parseInt(this.value);
        } else {
            selectedDonation = 0;
        }
        totalDonationAmountSpan.textContent = selectedDonation.toLocaleString();
        updateSubmitButtonState();
    });

    // 결제 방식 라디오 버튼 변경 이벤트
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateSubmitButtonState();
        });
    });

    // 전체 동의 체크박스 변경 이벤트
    agreeAllCheckbox.addEventListener('change', function() {
        termsCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateSubmitButtonState();
    });

    // 개별 약관 체크박스 변경 이벤트
    termsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 하나라도 해제되면 전체 동의 해제
            if (!this.checked && agreeAllCheckbox.checked) {
                agreeAllCheckbox.checked = false;
            }
            // 모든 약관이 체크되면 전체 동의 체크
            // (필수 약관이 체크되지 않아도 다른 선택 약관들이 모두 체크되면 전체 동의가 체크될 수 있으므로, 필수 약관 포함 모든 약관이 체크되었는지 확인)
            const allChecked = Array.from(termsCheckboxes).every(cb => cb.checked);
            agreeAllCheckbox.checked = allChecked;

            updateSubmitButtonState();
        });
    });

    // '후원 신청하기' 버튼 활성화 상태 업데이트 함수
    function updateSubmitButtonState() {
        const isDonationSelected = selectedDonation > 0;
        const isPaymentMethodSelected = document.querySelector('input[name="paymentMethod"]:checked') !== null;
        const isRequiredTermsAgreed = requiredTermsCheckbox ? requiredTermsCheckbox.checked : false; // 필수 약관 동의 여부

        // 모든 조건이 충족되면 버튼 활성화
        submitButton.disabled = !(isDonationSelected && isPaymentMethodSelected && isRequiredTermsAgreed);
    }

    // "보기" 링크 클릭 이벤트
    viewTermsLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // 기본 링크 동작 방지
            const termsId = this.dataset.termsId; // data-terms-id 값 가져오기
            termsContentDiv.innerHTML = termsData[termsId] || '<p>약관 내용을 불러올 수 없습니다.</p>'; // 약관 내용 삽입
            termsModal.style.display = 'flex'; // 모달 표시
        });
    });

    // 닫기 버튼 클릭 이벤트
    closeButton.addEventListener('click', function() {
        termsModal.style.display = 'none'; // 모달 숨김
    });

    // 모달 외부 클릭 시 닫기 (선택 사항)
    window.addEventListener('click', function(event) {
        if (event.target == termsModal) {
            termsModal.style.display = 'none';
        }
    });

    // 초기 상태 업데이트
    updateSubmitButtonState();
});