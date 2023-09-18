export const CreateImage = (nodes) => {
    const nodesBounds = getRectOfNodes(nodes);
    const transform = getTransformForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2
    );

    toPng(document.querySelector(".react-flow__viewport"), {
        backgroundColor: "#ffffff",
        width: imageWidth,
        height: imageHeight,
        style: {
            width: imageWidth,
            height: imageHeight,
            transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
        },
    }).then()
}