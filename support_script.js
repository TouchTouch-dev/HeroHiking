// support_script.js

document.addEventListener('DOMContentLoaded', function() {
    const supportTypeOptions = document.querySelectorAll('.support-type-options .radio-card');
    const amountOptions = document.querySelectorAll('.amount-options .radio-card');
    const customAmountInput = document.getElementById('customAmount');
    const displayAmountSpan = document.getElementById('displayAmount');
    const nextButton = document.getElementById('nextButton');

    // 초기 선택 값 (모두 null로 시작하여 어떤 것도 선택되지 않은 상태로 시작)
    let selectedSupportType = null;
    let selectedAmount = null;

    // 페이지 로드 시 '선택된 금액'을 0원으로 초기화 (HTML에 이미 반영되어 있을 수 있지만, 스크립트가 로드된 후에도 확실하게)
    displayAmountSpan.textContent = '0원';

    // '직접 입력' input 값이 변경될 때마다 selectedAmount 업데이트 및 화면 표시
    customAmountInput.addEventListener('input', function() {
        // 숫자만 입력되도록 필터링 및 콤마 제거
        const rawValue = this.value.replace(/[^0-9]/g, '');
        const numberValue = parseInt(rawValue, 10);

        // 유효한 숫자인 경우에만 처리
        if (!isNaN(numberValue) && numberValue > 0) {
            selectedAmount = numberValue.toString(); // 문자열로 저장
            displayAmountSpan.textContent = numberValue.toLocaleString() + '원'; // 콤마 추가하여 표시

            // 직접 입력 시 다른 금액 버튼 선택 해제 및 radio button checked 해제
            amountOptions.forEach(card => card.classList.remove('active'));
            amountOptions.forEach(card => card.querySelector('input[type="radio"]').checked = false);
        } else {
            selectedAmount = null; // 유효하지 않은 경우 금액 선택 해제
            displayAmountSpan.textContent = '0원'; // 금액이 없거나 유효하지 않으면 0원으로 표시
        }
        updateNextButtonState();
    });

    // 후원 종류 선택 처리
    supportTypeOptions.forEach(card => {
        card.addEventListener('click', function() {
            // 모든 후원 종류 선택 해제 및 radio button checked 해제
            supportTypeOptions.forEach(item => item.classList.remove('active'));
            supportTypeOptions.forEach(item => item.querySelector('input[type="radio"]').checked = false);

            // 현재 클릭된 카드 활성화 및 radio button checked
            this.classList.add('active');
            this.querySelector('input[type="radio"]').checked = true;
            selectedSupportType = this.querySelector('input[type="radio"]').value; // 선택된 후원 종류 값 저장
            updateNextButtonState(); // 버튼 상태 업데이트
        });
    });

    // 후원 금액 선택 처리
    amountOptions.forEach(card => {
        card.addEventListener('click', function() {
            // 모든 후원 금액 선택 해제 및 radio button checked 해제
            amountOptions.forEach(item => item.classList.remove('active'));
            amountOptions.forEach(item => item.querySelector('input[type="radio"]').checked = false);

            // 현재 클릭된 카드 활성화 및 radio button checked
            this.classList.add('active');
            this.querySelector('input[type="radio"]').checked = true;
            selectedAmount = this.dataset.amount; // data-amount 값 저장
            displayAmountSpan.textContent = parseInt(selectedAmount, 10).toLocaleString() + '원'; // 화면에 표시
            customAmountInput.value = ''; // 직접 입력 필드 초기화
            updateNextButtonState(); // 버튼 상태 업데이트
        });
    });

    // '다음 단계로' 버튼 활성화 상태 업데이트 함수
    function updateNextButtonState() {
        // 후원 종류가 선택되었고 (selectedSupportType이 null이 아님),
        // 후원 금액이 선택되었거나 (selectedAmount가 null이 아니고 유효한 숫자) 인 경우에만 활성화
        const isSupportTypeSelected = selectedSupportType !== null;
        const isAmountSelected = selectedAmount !== null && selectedAmount !== '' && parseInt(selectedAmount, 10) > 0;

        if (isSupportTypeSelected && isAmountSelected) {
            nextButton.disabled = false; // 활성화
        } else {
            nextButton.disabled = true; // 비활성화
        }
    }

    // 페이지 로드 시 초기 상태 업데이트
    updateNextButtonState();
});