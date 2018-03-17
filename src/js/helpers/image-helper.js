export function setImage(parent, image, size){
    var icon = new Image();
    icon.src = image;
    icon.height = size.height;
    icon.width =size.width;
    parent.append(icon);
}