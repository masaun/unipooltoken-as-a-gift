// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  EthereumCall,
  EthereumEvent,
  SmartContract,
  EthereumValue,
  JSONValue,
  TypedMap,
  Entity,
  EthereumTuple,
  Bytes,
  Address,
  BigInt,
  CallResult
} from "@graphprotocol/graph-ts";

export class AssetSourceUpdated extends EthereumEvent {
  get params(): AssetSourceUpdated__Params {
    return new AssetSourceUpdated__Params(this);
  }
}

export class AssetSourceUpdated__Params {
  _event: AssetSourceUpdated;

  constructor(event: AssetSourceUpdated) {
    this._event = event;
  }

  get asset(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get source(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class FallbackOracleUpdated extends EthereumEvent {
  get params(): FallbackOracleUpdated__Params {
    return new FallbackOracleUpdated__Params(this);
  }
}

export class FallbackOracleUpdated__Params {
  _event: FallbackOracleUpdated;

  constructor(event: FallbackOracleUpdated) {
    this._event = event;
  }

  get fallbackOracle(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class OwnershipTransferred extends EthereumEvent {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class ChainlinkProxyPriceProvider extends SmartContract {
  static bind(address: Address): ChainlinkProxyPriceProvider {
    return new ChainlinkProxyPriceProvider(
      "ChainlinkProxyPriceProvider",
      address
    );
  }

  fallbackOracle(): Address {
    let result = super.call("fallbackOracle", []);

    return result[0].toAddress();
  }

  try_fallbackOracle(): CallResult<Address> {
    let result = super.tryCall("fallbackOracle", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toAddress());
  }

  isOwner(): boolean {
    let result = super.call("isOwner", []);

    return result[0].toBoolean();
  }

  try_isOwner(): CallResult<boolean> {
    let result = super.tryCall("isOwner", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBoolean());
  }

  owner(): Address {
    let result = super.call("owner", []);

    return result[0].toAddress();
  }

  try_owner(): CallResult<Address> {
    let result = super.tryCall("owner", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toAddress());
  }

  getAssetPrice(_asset: Address): BigInt {
    let result = super.call("getAssetPrice", [
      EthereumValue.fromAddress(_asset)
    ]);

    return result[0].toBigInt();
  }

  try_getAssetPrice(_asset: Address): CallResult<BigInt> {
    let result = super.tryCall("getAssetPrice", [
      EthereumValue.fromAddress(_asset)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigInt());
  }

  getAssetsPrices(_assets: Array<Address>): Array<BigInt> {
    let result = super.call("getAssetsPrices", [
      EthereumValue.fromAddressArray(_assets)
    ]);

    return result[0].toBigIntArray();
  }

  try_getAssetsPrices(_assets: Array<Address>): CallResult<Array<BigInt>> {
    let result = super.tryCall("getAssetsPrices", [
      EthereumValue.fromAddressArray(_assets)
    ]);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toBigIntArray());
  }
}

export class ConstructorCall extends EthereumCall {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _assets(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get _sources(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }

  get _fallbackOracle(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends EthereumCall {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends EthereumCall {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class SetAssetSourcesCall extends EthereumCall {
  get inputs(): SetAssetSourcesCall__Inputs {
    return new SetAssetSourcesCall__Inputs(this);
  }

  get outputs(): SetAssetSourcesCall__Outputs {
    return new SetAssetSourcesCall__Outputs(this);
  }
}

export class SetAssetSourcesCall__Inputs {
  _call: SetAssetSourcesCall;

  constructor(call: SetAssetSourcesCall) {
    this._call = call;
  }

  get _assets(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get _sources(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }
}

export class SetAssetSourcesCall__Outputs {
  _call: SetAssetSourcesCall;

  constructor(call: SetAssetSourcesCall) {
    this._call = call;
  }
}

export class SetFallbackOracleCall extends EthereumCall {
  get inputs(): SetFallbackOracleCall__Inputs {
    return new SetFallbackOracleCall__Inputs(this);
  }

  get outputs(): SetFallbackOracleCall__Outputs {
    return new SetFallbackOracleCall__Outputs(this);
  }
}

export class SetFallbackOracleCall__Inputs {
  _call: SetFallbackOracleCall;

  constructor(call: SetFallbackOracleCall) {
    this._call = call;
  }

  get _fallbackOracle(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetFallbackOracleCall__Outputs {
  _call: SetFallbackOracleCall;

  constructor(call: SetFallbackOracleCall) {
    this._call = call;
  }
}
