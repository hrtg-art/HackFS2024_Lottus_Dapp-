import React from "react";

const SquidWidgetModal: React.FC = () => {
  const openModal = () => {
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div>
      {/* Botón para abrir el modal con el texto personalizado */}
      <button className="btn" onClick={openModal}>
        Tap me to swap from other chains here! <span className="loading loading-ring loading-lg"></span>
      </button>

      {/* Modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-[500px] max-w-full">
          <form method="dialog">
            {/* Botón para cerrar el modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className="flex justify-center items-center">
            <iframe
              title="squid_widget"
              width="400"
              height="700"
              src="https://widget.squidrouter.com/iframe?config=%7B%22integratorId%22%3A%22squid-swap-widget%22%2C%22companyName%22%3A%22Custom%22%2C%22style%22%3A%7B%22neutralContent%22%3A%22%23C4AEEC%22%2C%22baseContent%22%3A%22%23070002%22%2C%22base100%22%3A%22%23ffffff%22%2C%22base200%22%3A%22%23fafafa%22%2C%22base300%22%3A%22%23e8e8e8%22%2C%22error%22%3A%22%23ED6A5E%22%2C%22warning%22%3A%22%23FFB155%22%2C%22success%22%3A%22%232EAEB0%22%2C%22primary%22%3A%22%23A992EA%22%2C%22secondary%22%3A%22%23F89CC3%22%2C%22secondaryContent%22%3A%22%23F7F6FB%22%2C%22neutral%22%3A%22%23FFFFFF%22%2C%22roundedBtn%22%3A%2226px%22%2C%22roundedCornerBtn%22%3A%22999px%22%2C%22roundedBox%22%3A%221rem%22%2C%22roundedDropDown%22%3A%2220rem%22%7D%2C%22slippage%22%3A1.5%2C%22infiniteApproval%22%3Afalse%2C%22enableExpress%22%3Atrue%2C%22apiUrl%22%3A%22https%3A%2F%2Fapi.squidrouter.com%22%2C%22comingSoonChainIds%22%3A%5B%5D%2C%22titles%22%3A%7B%22swap%22%3A%22Swap%22%2C%22settings%22%3A%22Settings%22%2C%22wallets%22%3A%22Wallets%22%2C%22tokens%22%3A%22Select%20Token%22%2C%22chains%22%3A%22Select%20Chain%22%2C%22history%22%3A%22History%22%2C%22transaction%22%3A%22Transaction%22%2C%22allTokens%22%3A%22Select%20Token%22%2C%22destination%22%3A%22Destination%20address%22%2C%22depositAddress%22%3A%22Deposit%20address%22%7D%2C%22priceImpactWarnings%22%3A%7B%22warning%22%3A3%2C%22critical%22%3A5%7D%2C%22environment%22%3A%22mainnet%22%2C%22showOnRampLink%22%3Atrue%2C%22defaultTokens%22%3A%5B%5D%2C%22preferDex%22%3A%5B%22%22%5D%2C%22collectFees%22%3A%7B%22integratorAddress%22%3A%220x77B3e022922908Af2949415899e82fD40Cde8714%22%2C%22fee%22%3A100%7D%7D"
              style={{ border: "none", overflow: "hidden" }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SquidWidgetModal;
