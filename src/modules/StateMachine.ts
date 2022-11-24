interface IStateFunctions {
  onEnter?: () => void;
  onUpdate?: (deltaTime: number) => void;
  onExit?: () => void;
}

type stateName = string;

interface IState extends IStateFunctions { name: stateName; }

let idCounter = 0;

export default class StateMachine<stateNames extends string = stateName> {
  private states = new Map<stateNames, IState>();
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

  public addState(stateName: stateNames, config: IStateFunctions) {
    const { ctx } = this;
    this.states.set(stateName, {
      name: stateName,
      onEnter: config?.onEnter?.bind(ctx),
      onUpdate: config?.onUpdate?.bind(ctx),
      onExit: config?.onExit?.bind(ctx)
    });
    return this;
  }

  public setState(name: stateNames): void {
    if (!this.states.has(name)) return console.warn(`[StateMachine::${this.id}:setState] State ${name} does not exist`);
    if (this.isCurrentState(name)) return console.warn(`[StateMachine::${this.id}:setState] State ${name} is already the current state`);
    if (this.isChangingState){
      console.warn(`[StateMachine::${this.id}:setState] State ${name} is already changing`);
      this.changeStateQueue.push(name);
      return;
    }

    this.isChangingState = true;
    console.log(`[StateMachine::${this.id}:setState] Changing state from ${this.currentState?.name ?? 'none'} to ${name}`);

    if (this.currentState?.onExit) this.currentState.onExit();
    this.currentState = this.states.get(name);
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
      this.setState(this.changeStateQueue.shift() as stateNames);
      return;
    }
    if (this.currentState?.onUpdate) this.currentState.onUpdate(deltaTime);
  }
}
