

export default class ObstaclesController {
  private obstacles = new Map<string, MatterJS.BodyType>();
  private createKey(name: string, id: number){ return `${name}-${id}`; }

  public add(name: string, body: MatterJS.BodyType) {
    const key = this.createKey(name, body.id);

    if (this.obstacles.has(key)) return console.warn(`[ObstaclesController:add] Obstacle ${key} already exists`);
    this.obstacles.set(key, body);
  }

  public remove(name: string, body: MatterJS.BodyType) {
    const key = this.createKey(name, body.id);

    if (!this.obstacles.has(key)) return console.warn(`[ObstaclesController:remove] Obstacle ${key} does not exist`);
    this.obstacles.delete(key);
  }

  public exists(name: string, body: MatterJS.BodyType) {
    const key = this.createKey(name, body.id);
    return this.obstacles.has(key);
  }
}
