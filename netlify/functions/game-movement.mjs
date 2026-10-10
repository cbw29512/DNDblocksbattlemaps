import {validateBoardSnapshot} from './game-board-schema.mjs';
import {canMoveEntity} from './game-permissions.mjs';

const integer=Number.isSafeInteger;
/** Pure reducer only. Must be called inside a serialized DB transaction. */
export function applyMove(board,command,actor,assignedEntityIds=[]){
  try {
    if(!validateBoardSnapshot(board))return {status:503,error:'Board unavailable'};
    if(!command || typeof command!=='object' || Array.isArray(command))
      return {status:400,error:'Invalid command'};
    const {entityId,expectedRevision,destination}=command;
    if(!integer(expectedRevision)||expectedRevision<0||
       typeof entityId!=='string'||!entityId||!destination||
       !['x','z','elevation'].every(k=>integer(destination[k])))
      return {status:400,error:'Invalid movement'};
    if(expectedRevision!==board.revision)
      return {status:409,error:'Board changed; refresh before moving'};
    const {minX,maxX,minZ,maxZ}=board.bounds;
    if(destination.x<minX||destination.x>=maxX||destination.z<minZ||
       destination.z>=maxZ||destination.elevation<0||destination.elevation>100)
      return {status:400,error:'Destination outside board'};
    const index=board.objects.findIndex(item=>item.id===entityId);
    if(index<0)return {status:404,error:'Piece not found'};
    if(!canMoveEntity({actor,entity:board.objects[index],assignedEntityIds}))
      return {status:403,error:'Movement not permitted'};
    if(board.revision>=Number.MAX_SAFE_INTEGER)return {status:503,error:'Revision exhausted'};
    const next={...board,revision:board.revision+1,objects:board.objects.map((item,i)=>
      i===index?{...item,x:destination.x,z:destination.z,elevation:destination.elevation}:item)};
    return {status:200,board:next,revision:next.revision};
  }catch(error){
    console.error('Move reducer failed:',error instanceof Error?error.name:'Unknown');
    return {status:503,error:'Movement unavailable'};
  }
}
