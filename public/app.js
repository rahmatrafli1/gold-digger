const statusLabel = document.getElementById("statusLabel");
const statusDot = document.getElementById("statusDot");
const priceBox = document.getElementById("priceBox");
const amountInput = document.getElementById("amountInput");
const investBtn = document.getElementById("investBtn");
const overlay = document.getElementById("overlay");
const summaryText = document.getElementById("summaryText");
const okBtn = document.getElementById("okBtn");

let currentPrice = null;

// ---------- Connect to backend via SSE ----------
function connectLivePrice() {
  const source = new EventSource("/live-price");

  source.onopen = () => {
    setConnected(true);
  };

  source.onmessage = (event) => {
    const data = JSON.parse(event.data);
    currentPrice = data.price;
    priceBox.textContent = `Rp${formatRupiah(currentPrice)} / Oz*`;
    setConnected(true);
  };

  source.onerror = () => {
    setConnected(false);
    source.close();
    setTimeout(connectLivePrice, 3000);
  };
}

function setConnected(isConnected) {
  if (isConnected) {
    statusLabel.textContent = "Live prices";
    statusDot.classList.remove("dot-red");
    statusDot.classList.add("dot-green");
    amountInput.disabled = false;
    investBtn.disabled = false;
  } else {
    statusLabel.textContent = "Disconnected";
    statusDot.classList.remove("dot-green");
    statusDot.classList.add("dot-red");
    priceBox.textContent = "Rp----.-- / Oz*";
    amountInput.disabled = true;
    investBtn.disabled = true;
  }
}

// ---------- Invest button click ----------
investBtn.addEventListener("click", async () => {
  const amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    const res = await fetch("/invest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    summaryText.innerHTML = `
      You bought ${data.goldSold} ounces (ozt) for Rp${formatRupiah(data.amountPaid)}.
      The sale has executed and we're preparing your documentation.
      <br><br>
      <a href="${data.invoiceUrl}" target="_blank" style="color:#d4af37; font-weight:bold;">
        📄 Download Invoice (PDF)
      </a>
      <br>
      <small style="color:#aaa;">Confirmation email sent (mocked) ✅</small>
    `;
    overlay.classList.remove("hidden");
  } catch (err) {
    alert("Something went wrong. Please try again.");
  }
});

okBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
  amountInput.value = "";
});

// Start connection on load
connectLivePrice();

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID").format(number);
}
