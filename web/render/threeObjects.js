import { PALETTE } from '../domain/catalog.js';
export const CAMERA_DISTANCE=19;
export const MIN_CAMERA_DISTANCE=5;
export const MAX_CAMERA_DISTANCE=46;
const textureCache=new Map();
function textureFor(THREE,src){
 const cached=textureCache.get(src);if(cached)return cached;
 const texture=new THREE.TextureLoader().load(src,undefined,undefined,(error)=>console.warn('Catalog art failed to load',{src,error}));
 texture.colorSpace=THREE.SRGBColorSpace;textureCache.set(src,texture);return texture;
}
function materialFor(THREE,item){
 if(!item.art)return new THREE.MeshStandardMaterial({color:item.color,roughness:.72});
 const art=new THREE.MeshBasicMaterial({color:0xffffff,map:textureFor(THREE,item.art.src),transparent:true,alphaTest:.02});
 const cap=new THREE.MeshStandardMaterial({color:item.color,roughness:.75});
 return [art,art,cap,cap,art,art];
}
export function geometryFor(THREE,catalogId){
 const item=PALETTE[catalogId];
 if(item.shape==='pillar')return new THREE.CylinderGeometry(item.width/2,item.width/2,item.height,12);
 if(item.shape==='barrel')return new THREE.CylinderGeometry(item.width/2,item.width*.44,item.height,12);
 return new THREE.BoxGeometry(item.width,item.height,item.depth);
}
export function meshFor(THREE,object){
 const item=PALETTE[object.catalogId];const mesh=new THREE.Mesh(geometryFor(THREE,object.catalogId),materialFor(THREE,item));
 mesh.position.set(object.x+.5,object.elevation+item.height/2,object.z+.5);mesh.castShadow=true;mesh.receiveShadow=true;
 mesh.userData.objectId=object.id;mesh.userData.gridX=object.x;mesh.userData.gridZ=object.z;mesh.userData.elevation=object.elevation;return mesh;
}
export function setDefaultCamera(camera,controls){const horizontal=Math.cos(Math.PI/6)*CAMERA_DISTANCE;camera.position.set(horizontal/Math.sqrt(2),CAMERA_DISTANCE/2,horizontal/Math.sqrt(2));controls.target.set(0,0,0);controls.update();}
export function rotateCamera(THREE,camera,controls,delta){const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),delta);camera.position.copy(controls.target).add(offset);controls.update();}
export function zoomCamera(camera,controls,multiplier){const offset=camera.position.clone().sub(controls.target).multiplyScalar(multiplier);if(offset.length()>=MIN_CAMERA_DISTANCE&&offset.length()<=MAX_CAMERA_DISTANCE)camera.position.copy(controls.target).add(offset);controls.update();}
