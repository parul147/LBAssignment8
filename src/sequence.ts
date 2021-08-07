import { AuthenticationBindings ,AuthenticateFn, AUTHENTICATION_STRATEGY_NOT_FOUND, USER_PROFILE_NOT_FOUND} from "@loopback/authentication";
import { inject } from "@loopback/core";
import { SequenceHandler, SequenceActions, InvokeMiddleware, FindRoute, ParseParams, InvokeMethod, Send, Reject, RequestContext } from "@loopback/rest";
import debug from "debug";

export class MySequence implements SequenceHandler {
    /**
     * Optional invoker for registered middleware in a chain.
     * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
     */
    @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
    protected invokeMiddleware: InvokeMiddleware = () => false;
  
    /**
     * Constructor: Injects findRoute, invokeMethod & logError
     * methods as promises.
     *
     * @param findRoute - Finds the appropriate controller method,
     *  spec and args for invocation (injected via SequenceActions.FIND_ROUTE).
     * @param parseParams - The parameter parsing function (injected
     * via SequenceActions.PARSE_PARAMS).
     * @param invoke - Invokes the method specified by the route
     * (injected via SequenceActions.INVOKE_METHOD).
     * @param send - The action to merge the invoke result with the response
     * (injected via SequenceActions.SEND)
     * @param reject - The action to take if the invoke returns a rejected
     * promise result (injected via SequenceActions.REJECT).
     */
    constructor(
      @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
      @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
      @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
      @inject(SequenceActions.SEND) public send: Send,
      @inject(SequenceActions.REJECT) public reject: Reject,
      @inject(AuthenticationBindings.AUTH_ACTION)
      protected authenticationRequest: AuthenticateFn,
    ) {}
  
   
    async handle(context: RequestContext): Promise<void> {
      try {
        const {request, response} = context;
       
        
        const route = this.findRoute(request);
        //call authentication action
        await this.authenticationRequest(request);
        const args = await this.parseParams(request, route);
        const result = await this.invoke(route, args);
  
       
        this.send(response, result);
      } catch (error) {

        if(error.code === AUTHENTICATION_STRATEGY_NOT_FOUND || 
            error.code === USER_PROFILE_NOT_FOUND){
                Object.assign(error, {statusCode: 401 /*unauthorozed*/})
            }
        this.reject(context, error);
      }
    }
  }