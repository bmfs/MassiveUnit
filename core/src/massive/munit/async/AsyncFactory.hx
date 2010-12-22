/****
* Copyright 2010 Massive Interactive. All rights reserved.
* 
* Redistribution and use in source and binary forms, with or without modification, are
* permitted provided that the following conditions are met:
* 
*    1. Redistributions of source code must retain the above copyright notice, this list of
*       conditions and the following disclaimer.
* 
*    2. Redistributions in binary form must reproduce the above copyright notice, this list
*       of conditions and the following disclaimer in the documentation and/or other materials
*       provided with the distribution.
* 
* THIS SOFTWARE IS PROVIDED BY MASSIVE INTERACTIVE ``AS IS'' AND ANY EXPRESS OR IMPLIED
* WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
* FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL MASSIVE INTERACTIVE OR
* CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
* ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
* NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
* ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* 
* The views and conclusions contained in the software and documentation are those of the
* authors and should not be interpreted as representing official policies, either expressed
* or implied, of Massive Interactive.
* 
****/



package massive.munit.async;

import haxe.PosInfos;

import massive.munit.async.delegate.AsyncBasicDelegate;

/**
 * Factory for asynchronous delegates.
 * 
 * <p>
 * An instance of this factory is passed to test methods which define themselves as asynchronous.
 * They can then request a delegate handler to 
 * </p>
 * <pre>
 * class TimerTest
 * {
 *     @Test("Async")
 *     public function testTimer(factory:AsyncFactory):Void
 *     {
 *         var handler:Dynamic = factory.createBasicHandler(this, onTestTimer);
 *         Timer.delay(onTestTimer, 100);
 *     }
 *     
 *     private function onTestTimer():Void
 *     {
 *         Assert.isTrue(true);
 *     }
 * }
 * </pre>
 * 
 * @author Mike Stead
 */
class AsyncFactory 
{
	/**
	 * The number of asynchronous delegates created by this factory.
	 */
	public var asyncDelegateCount(default, null):Int;
	
	public var observer:IAsyncDelegateObserver;

	/**
	 * Class constructor.
	 * 
	 * @param	observer			an observer for all asynchronous delegates this factory creates
	 */
	public function new(observer:IAsyncDelegateObserver) 
	{
		this.observer = observer;
		asyncDelegateCount = 0;
	}
	
	/**
	 * Create a basic AsyncDelegate which requires no parameters to be passed to its handler.
	 * 
	 * @param	testCase			test case instance where the async test originated
	 * @param	handler				the handler in the test case for a successful async response
	 * @param	?timeout			[optional] number of milliseconds to wait before timing out
	 * @param	?info				[optional] pos infos of the test which requests an instance of this delegate
	 * @return	an AsyncDelegate for handling MassiveUI Dispatcher notifications
	 */
	public function createBasicHandler(testCase:Dynamic, handler:Dynamic, ?timeout:Int, ?info:PosInfos):Dynamic
	{
		var dispatcher:AsyncBasicDelegate = new AsyncBasicDelegate(testCase, handler, timeout, info);
		dispatcher.observer = observer;
		asyncDelegateCount++;
		return dispatcher.delegateHandler;
	}
}