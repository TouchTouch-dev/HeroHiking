document.addEventListener('DOMContentLoaded', function() {
    const donationAmountSelect = document.getElementById('donationAmount');
    const customAmountInput = document.getElementById('customAmount');
    const totalDonationAmountSpan = document.getElementById('totalDonationAmount');
    const submitButton = document.getElementById('submitButton');
    const agreeAllCheckbox = document.getElementById('agreeAll');
    const termsCheckboxes = document.querySelectorAll('.terms-agreement input');
    const requiredTermsCheckbox = document.querySelector('.terms-agreement input:not(#agreeAll)[data-required="true"]');

    let selectedDonation = 0;

    // 후원 금액 드롭다운 변경 이벤트
    donationAmountSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customAmountInput.style.display = 'block';
            selectedDonation = parseInt(customAmountInput.value) || 0;
        } else if (this.value) {
            customAmountInput.style.display = 'none';
            selectedDonation = parseInt(this.value);
        } else {
            customAmountInput.style.display = 'none';
            selectedDonation = 0;
        }
        totalDonationAmountSpan.textContent = selectedDonation.toLocaleString();
        updateSubmitButtonState();
    });

    // 직접 입력 금액 필드 입력 이벤트
    customAmountInput.addEventListener('input', function() {
        const value = parseInt(this.value) || 0;
        if (value < 0) {
            alert('후원 금액은 0원 이상이어야 합니다.');
            this.value = '';
            selectedDonation = 0;
        } else if (value > 1000000) {
            alert('후원 금액은 최대 1,000,000원까지 가능합니다.');
            this.value = '1000000';
            selectedDonation = 1000000;
        } else {
            selectedDonation = value;
        }
        totalDonationAmountSpan.textContent = selectedDonation.toLocaleString();
        updateSubmitButtonState();
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
            // 모두 동의되면 전체 동의 체크 (필수 약관 모두 체크되었는지 확인)
            const allChecked = Array.from(termsCheckboxes).every(cb => cb.checked);
            agreeAllCheckbox.checked = allChecked;

            updateSubmitButtonState();
        });
    });

    // '후원 신청하기' 버튼 활성화 상태 업데이트 함수
    function updateSubmitButtonState() {
        const isDonationSelected = selectedDonation > 0;
        const isPaymentMethodSelected = document.querySelector('input:radio:checked') !== null;
        const isRequiredTermsAgreed = requiredTermsCheckbox ? requiredTermsCheckbox.checked : true; // 필수 약관이 없으면 항상 true

        submitButton.disabled = !(isDonationSelected && isPaymentMethodSelected && isRequiredTermsAgreed);
    }

    // 초기 상태 업데이트
    updateSubmitButtonState();
});