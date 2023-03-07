export function imagesMarkup(images) {
  return images
    .map(
      ({ flags, name }) => `
        <li>
            <div class="wrapper">
                <img
                    src="${flags.svg}"
                    alt="${name.common}"
                    class="image"
                />
                <span class="details-value">${name.common}</span>
            </div>
        </li>
    `
    )
    .join('');
}
