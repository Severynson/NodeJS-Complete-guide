const deleteProduct = async (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  try {
    const response = await fetch(`/admin/product/${prodId}`, {
      method: "DELETE",
      headers: {
        "csrf-token": csrf,
      },
    });

    // const data = await response.json();
    // console.log(data);

    if (response.status === 200)
      productElement.parentNode.removeChild(productElement);
    else alert("Error while deleting!");
  } catch (error) {
    console.error(error);
  }
};
