document.addEventListener('DOMContentLoaded', function() {
    const donationAmountSelect = document.getElementById('donationAmount');
    const totalDonationAmountSpan = document.getElementById('totalDonationAmount');
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const submitButton = document.getElementById('submitButton');
    const agreeAllCheckbox = document.getElementById('agreeAll');
    const termsCheckboxes = document.querySelectorAll('.terms-agreement input[type="checkbox"]');
    const requiredTermsCheckbox = document.querySelector('.terms-agreement input[data-required="true"]');

    let selectedDonation = 0; // 초기 후원 금액은 0
    totalDonationAmountSpan.textContent = selectedDonation.toLocaleString(); // 초기 표시

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

    // 초기 상태 업데이트
    updateSubmitButtonState();
});