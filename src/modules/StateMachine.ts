interface IStateFunctions {
  onEnter?: () => void;
  onUpdate?: (deltaTime: number) => void;
  onExit?: () => void;
}

interface IState extends IStateFunctions { name: string; }

let idCounter = 0;

export default class StateMachine {
  private states = new Map<string, IState>();
  private previousState: IState | undefined;
  private currentState?: IState;
  private isChangingState = false;
  private changeStateQueue: string[] = []
  
  private id = (idCounter++).toString();
  private ctx?: object;

  constructor(context?: object, id?: string) {
    if (id) this.id = id;
    if (context) this.ctx = context;
  }

  public addState(stateName: string, config: IStateFunctions) {
    const { ctx } = this;
    this.states.set(stateName, {
      name: stateName,
      onEnter: config?.onEnter?.bind(ctx),
      onUpdate: config?.onUpdate?.bind(ctx),
      onExit: config?.onExit?.bind(ctx)
    });
    return this;
  }

  public setState(stateName: string): void {
    if (!this.states.has(stateName)) return console.warn(`[StateMachine::${this.id}:setState] State ${stateName} does not exist`);
    if (this.isCurrentState(stateName)) return console.warn(`[StateMachine::${this.id}:setState] State ${stateName} is already the current state`);
    if (this.isChangingState){
      console.warn(`[StateMachine::${this.id}:setState] State ${stateName} is already changing`);
      this.changeStateQueue.push(stateName);
      return;
    }

    this.isChangingState = true;
    console.log(`[StateMachine::${this.id}:setState] Changing state from ${this.currentState?.name ?? 'none'} to ${stateName}`);

    if (this.currentState?.onExit) this.currentState.onExit();
    this.currentState = this.states.get(stateName);
    if (this.currentState?.onEnter) this.currentState.onEnter();

    this.isChangingState = false;
  }

  get previousStateName(): string {
    return this.previousState?.name ?? '';
  }

  private isCurrentState(stateName: string): boolean {
    if (!this.currentState) return false;
    return this.currentState.name === stateName;
  }

  public update(deltaTime: number): void {
    if (this.changeStateQueue.length > 0) {
      this.setState(this.changeStateQueue.shift() as string);
      return;
    }
    if (this.currentState?.onUpdate) this.currentState.onUpdate(deltaTime);
  }
}
