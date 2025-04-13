/** 地图标记 */
export type MapMarker = {
  /** 标记点 id */
  id: number;
  /** 聚合簇的 id */
  clusterId: number;
  /** 纬度 */
  latitude: number;
  /** 经度 */
  longitude: number;
  /** 标记点标题 */
  title: string;
  /** 标记点是否在当前视野内 */
  joinCluster: true;
};
