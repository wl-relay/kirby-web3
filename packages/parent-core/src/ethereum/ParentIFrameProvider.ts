import { DMZ } from "../DMZ";

export class ParentIFrameProvider {
  private host: string;
  private dmz: DMZ;

  constructor(dmz: DMZ) {
    this.host = "iframe";
    this.dmz = dmz;
  }

  public supportsSubscriptions(): boolean {
    // return this.base.supportsSubscriptions();
    return false;
  }

  public registerEventListeners(): void {
    // return this.base.registerEventListeners();
    console.log("calling registerEventListeners");
    return;
  }

  private async iframeMessage(method: string, callback?: (err: any, data: any) => any, ...params: any): Promise<any> {
    console.group();
    console.log("iframeMessage request:", method, params);
    const response = await this.dmz.send({ type: "WEB3_REQUEST", data: { method, params } });
    console.log("iframeMessage response", response.data);
    console.groupEnd();
    if (callback) {
      try {
        callback(null, response.data);
      } catch (err) {
        console.error("error in callback", err);
      }
    }
    return response.data;
  }

  public async send(data: any, cb: any): Promise<any> {
    return this.iframeMessage("send", cb, data);
  }

  public sendBatch(methods: any[], moduleInstance: any): Promise<any[]> {
    return this.iframeMessage("sendBatch", undefined, { methods, moduleInstance });
  }

  public subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: any[]): Promise<string> {
    return this.iframeMessage("subscribe", undefined, subscribeMethod, subscriptionMethod, parameters);
  }

  public unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean> {
    return this.iframeMessage("unsubscribe", undefined, subscriptionId, unsubscribeMethod);
  }

  public clearSubscriptions(unsubscribeMethod: string): Promise<boolean> {
    return this.iframeMessage("clearSubscriptions", undefined, unsubscribeMethod);
  }

  public on(type: string, callback: () => void): void {
    this.dmz.listen("WEB3_ON_" + type.toUpperCase(), callback);
  }

  public removeListener(type: string, callback: () => void): void {
    //return this.base.removeListener(type, callback);
  }

  public removeAllListeners(type: string): void {
    // return this.base.removeAllListeners(type);
  }

  public reset(): void {
    this.iframeMessage("reset", undefined, {});
  }

  public reconnect(): void {
    this.iframeMessage("reconnect", undefined, {});
  }

  public disconnect(code: number, reason: string): void {
    this.iframeMessage("disconnect", undefined, { code, reason });
  }
}
