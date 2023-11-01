import { Signal, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Observable } from 'rxjs';

export function signalFrom<A>(initialState: A, updated: Observable<Partial<A>>): Signal<A>
export function signalFrom<A>(initialState: A, updated: Observable<A>): Signal<A> {
	const signalA = signal(initialState);

	// ConnectedSignal.with expects argument of type PartialOrValue which does not work well with generic type A
	connect(signalA).with(updated as Observable<any>);

	return signalA;
};
