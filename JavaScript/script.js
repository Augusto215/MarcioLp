document.addEventListener('DOMContentLoaded', function () {
  // Input mask
  const phoneInput = document.querySelector("#phone");
  if (phoneInput) {

      const iti = window.intlTelInput(phoneInput, {
          i18n: {
              selectedCountryAriaLabel: "PaÃ­s selecionado",
              noCountrySelected: "Nenhum paÃ­s selecionado",
              countryListAriaLabel: "Lista de paÃ­ses",
              searchPlaceholder: "Procurar",
              zeroSearchResults: "Nenhum resultado encontrado",
              oneSearchResult: "1 resultado encontrado",
              multipleSearchResults: "${count} resultados encontrados",
              ac: "Ilha de AscensÃ£o",
              xk: "Kosovo"
          },
          initialCountry: 'br',
          strictMode: true,
          separateDialCode: true
      });

      // Limpa zeros Ã  esquerda enquanto digita
      phoneInput.addEventListener('keyup', () => {
          let num = phoneInput.value.replace(/\D/g, '');
          if (num.startsWith('0')) {
              phoneInput.value = num.replace(/^0+/, '');
          }
      });

      // Envio do formulÃ¡rio
      const form = document.querySelector("#form-pre-checkout");
      if (form) {
          form.addEventListener('submit', event => {
              event.preventDefault();

              const { iso2 } = iti.getSelectedCountryData();

              if (iso2 === 'br') {  

                // remove tudo que nÃ£o for nÃºmero
                const raw = phoneInput.value.replace(/\D/g, '');

                // bloqueia se tiver menos de 10 ou mais de 11 dÃ­gitos
                if (raw.length < 11 || raw.length > 11) {
                    document.querySelector("#form-pre-checkout").classList.add('is-invalid');
                    phoneInput.focus();
                    return;                 // nÃ£o manda o formulÃ¡rio
                }

                // se passou na validaÃ§Ã£o, limpa
                document.querySelector("#form-pre-checkout").classList.remove('is-invalid');  

              }

              const hiddenInput = document.querySelector("#fullPhoneNumber");
              if (hiddenInput) {
                  hiddenInput.value = iti.getNumber();
              }

              form.submit();
          });
      }

      // Reorganiza lista de paÃ­ses com polling
      let attempts = 0;
      const maxAttempts = 20;
      const intervalCheck = setInterval(() => {
          attempts++;
          const countryList = document.querySelector(".iti__country-list");
          if (countryList) {
              clearInterval(intervalCheck);

              const codes = ['br','us','pt'];
              codes.forEach(code => {
                  const el = countryList.querySelector(`.iti__country[data-country-code="${code}"]`);
                  if (el) {
                      el.remove();
                      countryList.insertBefore(el.cloneNode(true), countryList.firstChild);
                  }
              });

              const divider = document.createElement("li");
              divider.className = "iti__divider custom-divider";
              countryList.childNodes.length >= 3
                  ? countryList.insertBefore(divider, countryList.childNodes[3])
                  : countryList.appendChild(divider);
          } else if (attempts >= maxAttempts) {
              clearInterval(intervalCheck);
          }
      }, 500);
  }
});